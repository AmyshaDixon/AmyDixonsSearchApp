import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-search',
    standalone: false,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
    apiUrl: string = `http://localhost:5000/search?`;
    // Creating dictionary to store matches
    results: Map<string, string> = new Map();
    apiError: string = "";

    constructor() { }

    ngOnInit(): void {
    }

    async getResults(name: string, color: string): Promise<void> {
        // Reset api error
        this.apiError = "";

        // Build endpoint
        // The api call will work with a name and no color, but will not vice versa;
        // there are other inconsistencies, so best to handle by each case
        let endpoint = "";
        if (name.length > 0 && color.length > 0) {
            endpoint = `term=${name}&color=${color}`;
        }
        else if (name.length == 0 && color.length > 0) {
            endpoint = `color=${color}`;
        }
        else if (name.length > 0 && color.length == 0) {
            endpoint = `term=${name}`;
        }

        try {
            let response = await fetch(this.apiUrl + endpoint);
            let outcome = await response.json();

            // Store matches in dictionary
            this.results = outcome.matches;
        }
        catch (error) {
            this.apiError = `The API has returned the following error: [ ${error} ]. We apologize for the inconvienience.`
        }
    }
}