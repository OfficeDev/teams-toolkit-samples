import { LiveShareClient } from "@microsoft/live-share";
import { LiveShareHost } from "@microsoft/teams-js";
import { SharedMap } from "fluid-framework";

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

class FluidService {

    // Constants
    #PERSON_VALUE_KEY = "person-value-key"; // Key for use in shared map

    // Service state
    #container;                     // Fluid container
    #people = [];                   // Local array of people who will speak
    #registeredEventHandlers = [];  // Array of event handlers to call when contents change
    #connectPromise;                // Singleton promise so we only connect once

    // Public function returns a singleton promise that resolves when we're
    // connected to the Fluid Relay service
    connect = () => {
        if (!this.#connectPromise) {
            this.#connectPromise = this.#connect();
        }
        return this.#connectPromise
    }

    // Private function connects to the Fluid Relay service
    #connect = async () => {
        try {
            const liveShareHost = LiveShareHost.create();

            const liveShareClient = new LiveShareClient(liveShareHost);
            const { container } = await liveShareClient.joinContainer(
                // Container schema
                {
                    initialObjects: { personMap: SharedMap }
                });
            this.#container = container;

            const json = this.#container.initialObjects.personMap.get(this.#PERSON_VALUE_KEY) || "[]";
            this.#people = JSON.parse(json);

            // Register a function to update the app when data in the Fluid Relay changes
            this.#container.initialObjects.personMap.on("valueChanged", async () => {
                const json = this.#container.initialObjects.personMap.get(this.#PERSON_VALUE_KEY);
                this.#people = JSON.parse(json);
                for (let handler of this.#registeredEventHandlers) {
                    await handler(this.#people);
                }
            });

        }
        catch (error) {
            console.log(`Error in fluid service: ${error.message}`);
            throw (error);
        }
    }

    // Private function to update the Fluid relay from the local array of people
    #updateFluid = async () => {
        const json = JSON.stringify(this.#people);
        this.#container.initialObjects.personMap.set(this.#PERSON_VALUE_KEY, json);
    }

    // Public functions used by the UI
    addPerson = async (name) => {
        if (!name) {
            throw new Error (`Please enter a name to add to the list`);
        }
        if (this.#people.includes(name)) {
            throw new Error(`${name} is already on the list`);
        }
        this.#people.push(name);
        await this.#updateFluid();
    }

    removePerson = async (name) => {
        if (this.#people.includes(name)) {
            this.#people = this.#people.filter(item => item !== name);
        }
        await this.#updateFluid();
    }

    nextPerson = async () => {
        this.#people.shift();
        await this.#updateFluid();
    }

    shuffle = async () => {
        // Use the Fischer-Yates algorithm
        for (let i = this.#people.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            [this.#people[i], this.#people[j]] = [this.#people[j], this.#people[i]];
        }
        await this.#updateFluid();
    }

    getPersonList = async () => {
        return this.#people;
    }

    onNewData = (e) => {
        this.#registeredEventHandlers.push(e);
    }

}

export default new FluidService();