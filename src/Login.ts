import { User } from "./classes/User";
import { Admin } from "./classes/Admin";
import { Translator } from "./classes/Translator";
import fs from "fs";
import path from "path";
import { RegisteredUserDAO } from "./types/registeredUserdao.type";
import ConsoleHandling from "./classes/ConsoleHandling";
import { RegisteredUser } from "./classes/RegisteredUser";
 
export class Login {
    private _registeredUser: RegisteredUser[] = [];

    constructor() {
        let registeredUserRaw = fs.readFileSync(path.resolve(__dirname, './data/registeredUsers.json'));
        let registeredUserJson: RegisteredUserDAO[] = JSON.parse(registeredUserRaw.toString());

        for (let registeredUser of registeredUserJson) {
            this._registeredUser.push(new RegisteredUser(registeredUser));
        }
    }

    public async showFunctionalities(): Promise<void> {
        let answer: String = await ConsoleHandling.showPossibilities([
            "1. Continue as temporary User without login",
            "2. Login as registered User (Translator/Admin only)",
        ],
            "Which function do you want to use? (default 1): ");
            
        this.handleAnswer(answer);
    }

    private async handleAnswer(answer: String): Promise<void> {
        switch (answer) {
            case "1":
                this.continueAsUser();
                break;
            case "2":
                this.checkRole();
                break;
            default:
                this.continueAsUser();
                break;
        }
    }

    private continueAsUser(): void {
        let user: User = new User();
        user.showFunctionalities();
    }

    private async checkRole(): Promise<void> {
        let username: String = await ConsoleHandling.question("Username: ")
        let password: String = await ConsoleHandling.question("Password: ")

        for (let index in this._registeredUser) {
            let userinDB: RegisteredUser = this._registeredUser[index];
            if (userinDB.getUsername() === username && userinDB.getPassword() === password) {
                if (userinDB.getRole() === "translator") {
                    console.log("\nSuccesfully logged in as Translator! Welcome " + userinDB.getUsername());
                    let translator: Translator = new Translator(userinDB.getID(), userinDB.getUsername());
                    translator.showFunctionalities();
                } else if (userinDB.getRole() === "admin") {
                    console.log("\nSuccesfully logged in as Admin! Welcome " + userinDB.getUsername());
                    let admin: Admin = new Admin(userinDB.getID(), userinDB.getUsername());
                    admin.showFunctionalities();
                }
                return;
            }
        }
        await this.goNext();
    }

    private async goNext(): Promise<void> {
        let answer: String = await ConsoleHandling.question("\n" + "User not found or wrong password. Would you like to try again? (y/n)");
        switch (answer.toLowerCase()) {
            case "y":
            case "yes":
                this.checkRole();
                break;
            case "n":
            case "no":
                this.showFunctionalities();
                break;
            default:
                this.showFunctionalities();
                break;
        }
    }
}






