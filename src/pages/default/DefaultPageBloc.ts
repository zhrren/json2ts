import { Signal, signal } from "@preact/signals-react";
import { Json2Ts } from "@base/Json2Ts";
import { GenUtil } from "js-cutil/dist/base/cutil/GenUtil";
import { JsonUtil } from "js-cutil/dist/base/cutil/JsonUtil";

export class DefaultPageState {
  jsonInput = "";
  resultOutput = "";
  errorMessage = "";

  options = {
    sortAlphabetically: false,
    optionalFields: false,
    rootObjectName: "RootObject",
    addPrefix: false,
  };

  copyWith(params: {
    jsonInput?: string;
    resultOutput?: string;
    errorMessage?: string;
    options?: any;
  }): DefaultPageState {
    const state = GenUtil.copyWith(new DefaultPageState(), this, params);
    localStorage.setItem("DefaultPageState", JSON.stringify(state));
    return state;
  }
}

export class DefaultPageBloc {
  state: Signal<DefaultPageState> = signal(
    GenUtil.copyWith(new DefaultPageState(), JsonUtil.parse(localStorage.getItem("DefaultPageState") ?? "{}"), {})
  );

  handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.state.value = this.state.value.copyWith({ jsonInput: e.target.value });
  }

  handleRootObjectNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.state.value.options.rootObjectName = e.target.value;
    this.state.value = this.state.value.copyWith({});
  }

  transform() {
    const json2ts = new Json2Ts(this.state.value.options);

    this.state.value = this.state.value.copyWith({ errorMessage: "" });

    try {
      const json = JSON.parse(this.state.value.jsonInput);
      const resultOutput = json2ts.convert(json);
      this.state.value = this.state.value.copyWith({ resultOutput: resultOutput });
    } catch (e: any) {
      this.state.value = this.state.value.copyWith({ errorMessage: e.message });
    }
  }

  handleOptionalFieldsChange(e: boolean) {
    this.state.value.options.optionalFields = e;
    this.state.value = this.state.value.copyWith({});
  }

  handleSortAlphabeticallyChange(e: boolean) {
    this.state.value.options.sortAlphabetically = e;
    this.state.value = this.state.value.copyWith({});
  }

  handleAddPrefixChange(e: boolean) {
    this.state.value.options.addPrefix = e;
    this.state.value = this.state.value.copyWith({});
  }
}
