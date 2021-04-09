import { WordDAO } from "../types/worddao.type";
import { AbstractWord } from "./abstracts/AbstractWord";

export class Word extends AbstractWord {
  

  constructor(word: WordDAO) {
    super();
    this.setID(word._id);
    this.setWord(word._word);
    this.setEnglish(word._english);
    this.setSpanish(word._spanish);
    this.setItalian(word._italian);
  }
}