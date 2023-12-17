import { Type } from "class-transformer";

export class RootObject {
  id: number = 0;
  num: string = "";
  name: string = "";
  img: string = "";
  type: string[] = [];
  height: string = "";
  weight: string = "";
  candy: string = "";
  candy_count: number = 0;
  egg: string = "";
  spawn_chance: number = 0;
  avg_spawns: number = 0;
  spawn_time: string = "";
  multipliers: number[] = [];
  weaknesses: string[] = [];
  @Type(() => NextEvolution)
  next_evolution: NextEvolution[] = [];
  @Type(() => Evolution)
  evolution: Evolution = new Evolution();
}

export class NextEvolution {
  num: string = "";
  name: string = "";
}

export class Evolution {
  num: string = "";
  name: string = "";
}
