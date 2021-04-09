import { AbstractWord } from "./abstracts/AbstractWord";

export class NullWord extends AbstractWord {
  constructor() {
    super();
    this.setID("");
    this.setWord("Word not yet in the database! To add this word use function '2. Add Word'");
    this.setEnglish("-");
    this.setSpanish("-");
    this.setItalian("-");
  }
}