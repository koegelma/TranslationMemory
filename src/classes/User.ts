import ConsoleHandling from "./ConsoleHandling";
import { Word } from "./Word";
import { NullWord } from "./NullWord";
import fs from "fs";
import path from "path";
import { WordDAO } from "../types/worddao.type";
import { AbstractWord } from "./abstracts/AbstractWord";
import { v4 as uuidv4 } from 'uuid';

export class User {
  private _wordArr: Word[] = [];
  declare wordsAdded: number;

  constructor() {
    let wordsRaw = fs.readFileSync(path.resolve(__dirname, '../data/words.json'));
    let wordsJson: WordDAO[] = JSON.parse(wordsRaw.toString());

    for (let word of wordsJson) {
      this._wordArr.push(new Word(word));
    }

    this.wordsAdded = 0;
  }

  public async showFunctionalities(): Promise<void> {
    let answer: String = await ConsoleHandling.showPossibilities(
      [
        "1. Search for word",
        "2. Add word",
        "3. Show how many words you added to the database",
        "4. Show how many words are in the database"
      ],
      "Which function do you want to use? (default 1): ");

    this.handleAnswer(answer);
  }

  public async handleAnswer(answer: String): Promise<void> {
    switch (answer) {
      case "1":
        await this.searchWord();
        break;
      case "2":
        await this.addWord();
        break;
      case "3":
        this.showWordsAddedCount();
        break;
      case "4":
        this.showTotalWords();
        break;
      /*     case "5":
            this.createNewUUID();
            break; */
      default:
        this.searchWord();
        break;
    }
    await this.goNext();
  }

  public async searchWord(): Promise<void> {
    let searchedWord: String = await ConsoleHandling.question("Which word are you looking for? ")
    let word: AbstractWord = this._wordArr.filter((word) => word.getWord().match(new RegExp(`${searchedWord}`, 'gi')))[0];

    ConsoleHandling.printInput("")
    word = word !== undefined ? word : new NullWord();

    ConsoleHandling.printInput("German: " + word.getWord());
    ConsoleHandling.printInput("English: " + word.getEnglish());
    ConsoleHandling.printInput("Spanish: " + word.getSpanish());
    ConsoleHandling.printInput("Italian: " + word.getItalian());
  }

  public async addWord(): Promise<void> {
    let _addedWord: String = await ConsoleHandling.question("\nWhich word would you like to add? ")

    let _letters = /^[A-Za-z]+$/;

    if (_addedWord.match(_letters)) {

      let _wordData = {
        _id: await this.createUUID(),
        _word: _addedWord,
        _english: "",
        _spanish: "",
        _italian: ""
      };

      let _wordIsNew: boolean = true;

      for (let index in this._wordArr) {
        let word: Word = this._wordArr[index];
        if (word.getWord() === _addedWord) {
          _wordIsNew = false;
        }
      }

      if (_wordIsNew) {
        this._wordArr.push(new Word(_wordData));
        let newWordsJSON = JSON.stringify(this._wordArr, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../data/words.json'), newWordsJSON);
        //console.log(this._wordArr);
        this.wordsAdded++;
        ConsoleHandling.printInput("\nThe word " + _addedWord + " has been added!");
      } else if (!_wordIsNew) {
        ConsoleHandling.printInput("\nThis word already exists!");
      }
    } else {
      ConsoleHandling.printInput("\nOnly letters are allowed!")
    }
    this.goNext();
  }

  public showWordsAddedCount() : void{
    if (this.wordsAdded == 1) {
      ConsoleHandling.printInput("\nYou have added " + this.wordsAdded + " Word during this session.");
    } else {
      ConsoleHandling.printInput("\nYou have added " + this.wordsAdded + " Words during this session.");
    }
  }

  public showTotalWords(): void {
    ConsoleHandling.printInput("")
    let _index: number = 0;
    let totalWordsTranslated: number = 0;

    for (let index in this._wordArr) {
      let countTranslation: number = 0;
      _index = Number.parseInt(index) + 1;
      let word: Word = this._wordArr[index];
      if (word.getEnglish() !== "") {
        countTranslation++;
      }
      if (word.getSpanish() !== "") {
        countTranslation++;
      }
      if (word.getItalian() !== "") {
        countTranslation++;
      }
      if (countTranslation == 3) {
        totalWordsTranslated++;
      }
    }
    console.log("There are " + _index + " words in the database. Out of those " + totalWordsTranslated + " are translated in to every language.");
  }

  public async createUUID(): Promise<String> {
    let myuuid = uuidv4();
    return myuuid;
  }

  /*   public createNewUUID(): void {
      let newuuid = uuidv4();
      console.log('UUID is: ' + newuuid);
    } */

  public async goNext(): Promise<void> {
    let answer: String = await ConsoleHandling.question("\n" + "Want to use another function? (y/n) ");
    switch (answer.toLowerCase()) {
      case "y":
      case "yes":
        this.showFunctionalities();
        break;
      case "n":
      case "no":
        ConsoleHandling.closeConsole()
        break;
      default:
        this.showFunctionalities();
        break;
    }
  }
}
