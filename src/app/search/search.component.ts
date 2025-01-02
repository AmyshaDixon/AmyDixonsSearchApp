import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-search',
    standalone: false,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
    apiUrl: string = "http://localhost:5000/search?";
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
            console.log(this.apiUrl + endpoint);
            // Retrieve response
            let response = await fetch(this.apiUrl + endpoint);

            // Handle direct API code errors
            switch (response.status) {
                case 400:
                    this.apiError = "The API has returned the following error: [ 400: At least one parameter of the"
                        + " search criteria, name or color, is required]. We apologize for the inconvienience."
                case 404:
                    this.apiError = "The API has returned the following error: [ 404: Requested person not found ]."
                        + "We apologize for the inconvienience."
                    break;
                case 500:
                    this.apiError = "The API has returned the following error: [ 500: The server has encountered and unexpected error ]."
                        + "We apologize for the inconvienience."
                    break;
            }

            // Retrieve data
            let outcome = await response.json();

            // Store matches in dictionary
            this.results = outcome.matches;
        }
        catch (error) {
            // Handle any other unspecified error
            this.apiError = `The API has returned the following error: [ ${error} ]. We apologize for the inconvienience.`
        }
    }
}