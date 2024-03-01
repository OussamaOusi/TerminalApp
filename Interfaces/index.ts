import readline from 'readline-sync';
import{
    Fragrances
} from "./fragrances"


const fetchFromUrl = async () => {
    const response = await fetch("https://raw.githubusercontent.com/OussamaOusi/TerminalApp/main/parfum.json");
    const data = await response.json();
    showSubMenu(data);
}
const menuOptions: string[] = [
    "1. Show all fragrances",
    "2. Filter fragrances by id",
    "3. Exit"];

    function ShowAllFragrances(data:Fragrances[]){

        for (let i = 0; i < data.length; i++) {
            console.log(`$data[i].name}---${data[i].description}\n`);
        }

    }
    function FilterFragranceById(data:Fragrances[]){
        const id = readline.questionInt("Enter the id: ");
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                console.log(`${data[i].name}---${data[i].description}\n`);
            }
        }

    }

function showSubMenu(Fragrances:Fragrances[]){
    let subMenuOption = readline.keyInSelect(menuOptions,
        "Welcome to the Fragrance JSON data viewer. Choose an option: ",
        { cancel: false, guide: false });

    while (subMenuOption !== 2) {
        switch (subMenuOption) {
            case 0:
                ShowAllFragrance(Fragrances);
                break;
            case 1:
                FilterFragranceById(Fragrances);
                break;
            default:
                console.log("Please choose a valid option.");
                break;
        }
        subMenuOption = readline.keyInSelect(menuOptions,
            "Welcome to the Fragrance JSON data viewer. Choose an option: ",
            { cancel: false, guide: false });
    }
}
fetchFromUrl();
export {}