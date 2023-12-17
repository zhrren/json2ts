type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface IJson2TsConfigPrivate {
  sortAlphabetically: boolean;
  optionalFields: boolean;
  rootObjectName: string;
  addPrefix: boolean;
}

export type IJson2TsConfig = Partial<IJson2TsConfigPrivate>;

export class Json2Ts {
  private config: IJson2TsConfigPrivate;

  private interfaces: {
    [name: string]: {
      [field: string]: string;
    };
  } = {};

  constructor(config: IJson2TsConfig = {}) {
    this.config = {
      sortAlphabetically: false,
      optionalFields: false,
      rootObjectName: "RootObject",
      addPrefix: false,
      ...config,
    };
  }

  convert(json: {}) {
    this.interfaces = {};
    let result = ``;
    this.unknownToTS(json);
    result += this.interfacesToString();
    return result;
  }

  private unknownToTS(value: {}, key: string | undefined = void 0) {
    let type: string = typeof value;
    if (type === "object") {
      if (Array.isArray(value)) {
        type = this.arrayToTS(value, key);
      } else {
        type = this.objectToTS(value, key && this.capitalizeFirst(key));
      }
    }
    return type;
  }

  private arrayToTS(array: {}[], key: string | undefined = void 0) {
    let type = array.length ? void 0 : "any";
    for (let item of array) {
      const itemType = this.unknownToTS(item, this.keyToTypeName(key));
      if (type && itemType !== type) {
        type = "any";
        break;
      } else {
        type = itemType;
      }
    }
    return `${type}[]`;
  }

  private keyToTypeName(key: string | undefined = void 0) {
    if (!key || key.length < 2) {
      return key;
    }
    const [first, ...rest]: string[] = Array.prototype.slice.apply(key);
    const last = rest.pop();
    return [first.toUpperCase(), ...rest, last === "s" ? "" : last].join("");
  }

  private capitalizeFirst(str: string) {
    return str
      .replace(/_([a-z])/g, (match, p1) => {
        return p1.toUpperCase();
      })
      .replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1));
  }

  private objectToTS(obj: {}, type: string = this.config.rootObjectName) {
    if (obj === null) {
      return "any";
    }

    if (Object.keys(obj).includes("@t")) {
      // @ts-ignore
      const items = (obj["@t"] ?? "").split(".");
      if (items.length > 1) {
        type = items[items.length - 1];
      }
    }

    if (this.config.addPrefix && this.config.rootObjectName !== type) {
      const prefix = this.config.addPrefix ? this.config.rootObjectName : "";
      type = prefix + type;
    }

    if (!this.interfaces[type]) {
      this.interfaces[type] = {};
    }
    const interfaceName = this.interfaces[type];
    Object.keys(obj).forEach(key => {
      if (key === "@t") return;
      // @ts-ignore
      const value = obj[key];
      const fieldType = this.unknownToTS(value, key);
      if (!interfaceName[key] || interfaceName[key].indexOf("any") === 0) {
        interfaceName[key] = fieldType;
      }
    });
    return type;
  }

  private interfacesToString() {
    const { sortAlphabetically, optionalFields } = this.config;
    let outout = Object.keys(this.interfaces)
      .map(name => {
        const interfaceStr = [`export class ${name} {`];
        const fields = Object.keys(this.interfaces[name]);
        if (sortAlphabetically) {
          fields.sort();
        }
        fields.forEach(field => {
          const type = this.interfaces[name][field];
          const defaultValue = optionalFields ? "" : " = " + this.getDefaultValue(type);

          const customType = type.replace("[]", "");
          const customTypeCheck = Object.keys(this.interfaces).includes(customType);
          if (customTypeCheck) {
            interfaceStr.push(`  @Type(() => ${customType})`);
          }

          interfaceStr.push(`  ${field}${optionalFields ? "?" : ""}: ${type}${defaultValue};`);
        });
        interfaceStr.push("}\n");
        return interfaceStr.join("\n");
      })
      .join("\n");

    if (outout.includes("@Type")) outout = 'import { Type } from "class-transformer";\n\n' + outout;
    return outout;
  }

  private getDefaultValue(type: string) {
    if (type.includes("[]")) return "[]";
    switch (type) {
      case "string":
        return `""`;
      case "number":
        return `0`;
      case "boolean":
        return `false`;
      case "any":
        return `undefined`;
      default:
        return "new " + type + "()";
    }
  }
}
