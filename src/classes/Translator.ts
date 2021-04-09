import { User } from "./User";
import ConsoleHandling from "./ConsoleHandling";
import { Word } from "./Word";
import { WordDAO } from "../types/worddao.type";
import fs from "fs";
import path from "path";
import { RegisteredUser } from "./RegisteredUser";
import { RegisteredUserDAO } from "../types/registeredUserdao.type";


export class Translator extends User {
  private _wordArray: Word[] = [];
  private _registeredUsersArr: RegisteredUser[] = [];

  private _id: String;
  private __username: String;


  constructor(id: String, username: String,) {
    super()
    this._id = id;
    this.__username = username;


    let wordsRaw = fs.readFileSync(path.resolve(__dirname, '../data/words.json'));
    let wordsJson: WordDAO[] = JSON.parse(wordsRaw.toString());

    let regUserRaw = fs.readFileSync(path.resolve(__dirname, '../data/registeredUsers.json'));
    let regUserJson: RegisteredUserDAO[] = JSON.parse(regUserRaw.toString());

    for (let word of wordsJson) {
      this._wordArray.push(new Word(word));
    }

    for (let regUser of regUserJson) {
      this._registeredUsersArr.push(new RegisteredUser(regUser));
    }
  }

  public async showFunctionalities(): Promise<void> {
    let answer: String = await ConsoleHandling.showPossibilities(
      [
        "1. Search for word",
        "2. Add word",
        "3. Show how many words you added to the database",
        "4. Show how many words are in the database",
        "5. Show words with missing translation",
        "6. Add translation",
        "7. Show how many translations you added to the database",
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
        await this.addWordForTranslator();
        break;
      case "3":
        this.showWordsAdded();
        break;
      case "4":
        this.showTotalWords();
        break;
      case "5":
        this.showMissingTranslations();
        break;
      case "6":
        this.addTranslation();
        break;
      case "7":
        this.showTranslationCount();
        break;
      default:
        this.searchWord();
        break;
    }
    await this.goNext();
  }

  private async addWordForTranslator(): Promise<void> {
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

      for (let index in this._wordArray) {
        let word: Word = this._wordArray[index];
        if (word.getWord() === _addedWord) {
          _wordIsNew = false;
        }
      }

      if (_wordIsNew) {
        this._wordArray.push(new Word(_wordData));
        let newWordsJSON = JSON.stringify(this._wordArray, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../data/words.json'), newWordsJSON);
        this.incrementWordsAdded();
        ConsoleHandling.printInput("\nThe word " + _addedWord + " has been added!");
      } else if (!_wordIsNew) {
        ConsoleHandling.printInput("\nThis word already exists!");
      }
    } else {
      ConsoleHandling.printInput("\nOnly letters are allowed!")
    }
    this.goNext();
  }

  private incrementWordsAdded(): void {

    for (let index in this._registeredUsersArr) {
      let regUser: RegisteredUser = this._registeredUsersArr[index];
      let _index = Number.parseInt(index);
      let newWordsAdded: number = regUser.getWordsAdded();
      newWordsAdded++;

      if (regUser.getID() == this._id) {
        let _translatorData = {
          _id: regUser.getID(),
          _username: regUser.getUsername(),
          _password: regUser.getPassword(),
          _role: regUser.getRole(),
          _translatedWords: regUser.getTranslatedWords(),
          _wordsAdded: newWordsAdded,
          _english: regUser.getEnglish(),
          _spanish: regUser.getSpanish(),
          _italian: regUser.getItalian()
        };
        this._registeredUsersArr.splice(_index, 1, new RegisteredUser(_translatorData));
        let newRegUsersJSON = JSON.stringify(this._registeredUsersArr, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../data/registeredUsers.json'), newRegUsersJSON);
      }
    }
  }

  private showWordsAdded(): void {
    for (let index in this._registeredUsersArr) {
      let regUser: RegisteredUser = this._registeredUsersArr[index];

      if (regUser.getID() == this._id) {
        ConsoleHandling.printInput("\nYou have added " + regUser.getWordsAdded() + " words to the database.")
      }
    }
  }

  private showMissingTranslations(): void {
    ConsoleHandling.printInput("")

    ConsoleHandling.printInput("The following words are missing a translation: \n")

    for (let index in this._wordArray) {
      let _translatedLanguages: String[] = [];
      let _percentCompleteness: number;
      let _countTranslation: number = 0;
      let _word: Word = this._wordArray[index];

      if (_word.getEnglish() === "" || _word.getSpanish() === "" || _word.getItalian() === "") {
        if (_word.getEnglish() !== "") {
          _countTranslation++;
          _translatedLanguages.push("English")
        }
        if (_word.getSpanish() !== "") {
          _countTranslation++;
          _translatedLanguages.push(" Spanish")
        }
        if (_word.getItalian() !== "") {
          _countTranslation++;
          _translatedLanguages.push(" Italian")
        }
        _percentCompleteness = Math.round((_countTranslation / 3) * 100);
        if (_percentCompleteness != 0) {
          ConsoleHandling.printInput("- " + _word.getWord() + " (" + _percentCompleteness + " % translated). Translated languages are " + _translatedLanguages + ".\n");
        } else {
          ConsoleHandling.printInput("- " + _word.getWord() + " (" + _percentCompleteness + " % translated).\n");
        }
      }
    }
  }

  private async addTranslation(): Promise<void> {
    let _translateWord: String = await ConsoleHandling.question("\nWhich word would you like to translate? ")

    for (let indexWord in this._wordArray) {
      let _word: Word = this._wordArray[indexWord];
      let _indexWord = Number.parseInt(indexWord);

      if (_word.getWord() === _translateWord) {
        let _selectLanguage: String = await ConsoleHandling.question("\n Select a language you would like to translate this word to: \n\n1. English \n2. Spanish \n3. Italian \n\nLanguage: ");
        switch (_selectLanguage) {
          case "1":
          case "English":

            for (let indexRegUser in this._registeredUsersArr) {
              let regUser: RegisteredUser = this._registeredUsersArr[indexRegUser];
              if (regUser.getEnglish() == 1) {

                let _newTranslation: String = await ConsoleHandling.question("\nAdd translation for " + _word.getWord() + ": ");

                let _wordData = {
                  _id: _word.getID(),
                  _word: _word.getWord(),
                  _english: _newTranslation,
                  _spanish: _word.getSpanish(),
                  _italian: _word.getItalian()
                };

                this._wordArray.splice(_indexWord, 1, new Word(_wordData));
                let newWordJSON = JSON.stringify(this._wordArray, null, 2);
                fs.writeFileSync(path.resolve(__dirname, '../data/words.json'), newWordJSON);
                this.incrementTranslatedWords();
                ConsoleHandling.printInput("\n Translation has been added.")
                this.goNext();
              }
            }

            break;
          case "2":
          case "Spanish":

            for (let indexRegUser in this._registeredUsersArr) {
              let regUser: RegisteredUser = this._registeredUsersArr[indexRegUser];
              if (regUser.getSpanish() == 1) {

                let _newTranslation: String = await ConsoleHandling.question("\nAdd translation for " + _word.getWord() + ": ");

                let _wordData = {
                  _id: _word.getID(),
                  _word: _word.getWord(),
                  _english: _word.getEnglish(),
                  _spanish: _newTranslation,
                  _italian: _word.getItalian()
                };

                this._wordArray.splice(_indexWord, 1, new Word(_wordData));
                let newWordJSON = JSON.stringify(this._wordArray, null, 2);
                fs.writeFileSync(path.resolve(__dirname, '../data/words.json'), newWordJSON);
                this.incrementTranslatedWords();
                ConsoleHandling.printInput("\n Translation has been added.")
                this.goNext();
              }
            }

            break;
          case "3":
          case "Italian":

            for (let indexRegUser in this._registeredUsersArr) {
              let regUser: RegisteredUser = this._registeredUsersArr[indexRegUser];
              if (regUser.getItalian() == 1) {

                let _newTranslation: String = await ConsoleHandling.question("\nAdd translation for " + _word.getWord() + ": ");

                let _wordData = {
                  _id: _word.getID(),
                  _word: _word.getWord(),
                  _english: _word.getEnglish(),
                  _spanish: _word.getSpanish(),
                  _italian: _newTranslation
                };

                this._wordArray.splice(_indexWord, 1, new Word(_wordData));
                let newWordJSON = JSON.stringify(this._wordArray, null, 2);
                fs.writeFileSync(path.resolve(__dirname, '../data/words.json'), newWordJSON);
                this.incrementTranslatedWords();
                ConsoleHandling.printInput("\nTranslation has been added.")
                this.goNext();
              }
            }
            break;
        }
      }
    }
  }

  private incrementTranslatedWords(): void {

    for (let index in this._registeredUsersArr) {
      let regUser: RegisteredUser = this._registeredUsersArr[index];
      let _index = Number.parseInt(index);
      let newTranslatedWords: number = regUser.getTranslatedWords();
      newTranslatedWords++;

      if (regUser.getID() == this._id) {
        let _translatorData = {
          _id: regUser.getID(),
          _username: regUser.getUsername(),
          _password: regUser.getPassword(),
          _role: regUser.getRole(),
          _translatedWords: newTranslatedWords,
          _wordsAdded: regUser.getWordsAdded(),
          _english: regUser.getEnglish(),
          _spanish: regUser.getSpanish(),
          _italian: regUser.getItalian()
        };
        this._registeredUsersArr.splice(_index, 1, new RegisteredUser(_translatorData));
        let newRegUsersJSON = JSON.stringify(this._registeredUsersArr, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../data/registeredUsers.json'), newRegUsersJSON);
      }
    }

  }

  private showTranslationCount(): void {
    for (let index in this._registeredUsersArr) {
      let regUser: RegisteredUser = this._registeredUsersArr[index];

      if (regUser.getID() == this._id) {
        ConsoleHandling.printInput("\nYou have added " + regUser.getTranslatedWords() + " translations to the database.")
      }
    }
  }

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