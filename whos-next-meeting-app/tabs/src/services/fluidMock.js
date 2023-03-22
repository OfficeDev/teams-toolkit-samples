// interface IFluidService {
//     connect: () => void;                             // Connect to the Fluid service
//     addPerson: (name: string) => Promise<void>;      // Add a person to the list
//     removePerson: (name: string) => Promise<void>;   // Remove a person from the list
//     nextPerson: () => Promise<void>;                 // Go to next person
//     shuffle: () => Promise<void>;                    // Shuffle the list of speakers
//     getPersonList: () => Promise<string[]>;          // Get the current person list
//     // Event handler called when new person list is available
//     onNewData: (handler: (personList: string[]) => void) => void;
// }

class MockFluidService {

    // For the mock service, this is the list of speakers
    #people = ["Alice", "Bob", "Charlene"];
    #registeredEventHandlers = [];

    connect = async () => { }
  
    addPerson = async (name) => {
        this.#people.push(name);
        await this.#fireChangedEvent();
    }

    removePerson = async (name) => {
        this.#people = this.#people.filter(item => item !== name);
        await this.#fireChangedEvent();
    }

    nextPerson = async () => {
        this.#people.shift();
        await this.#fireChangedEvent();
    }

    shuffle = async () => {
        // Use the Fischer-Yates algorithm
        for (let i = this.#people.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            [this.#people[i], this.#people[j]] = [this.#people[j], this.#people[i]];
        }
        await this.#fireChangedEvent();
    }

    getPersonList = async () => {
        return this.#people;
    }

    onNewData = (e) => {
        this.#registeredEventHandlers.push(e);
    }

    #fireChangedEvent = async () => {
        for (let handler of this.#registeredEventHandlers) {
            await handler(this.#people);
        }
    }

}

export default new MockFluidService();