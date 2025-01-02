import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-search',
    standalone: false,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
    apiUrl: string = "http://localhost:5000/search?";
    // Create "dictionary" (python background) to store matches
    results: Map<string, string> = new Map();
    apiError: string = "";

    constructor() { }

    ngOnInit(): void {
        // Check for cookie
        let searchCookie = document.cookie;

        if (searchCookie) {
            // Remove everything but the criteria needed
            searchCookie.replace(/name|=|;|color/g, "");
            //console.log("searchCookie: " + searchCookie);

            // Split by space
            let searchCriteria = searchCookie.split(" ");

            // Repopulate search with criteria from cookie
            this.getResults(searchCriteria[0], searchCookie[1]);
        }
    }

    /**
     * Connects to and pulls data from the /search? API response
     * @param name - The inputted name that the user wishes to search for
     * @param color - The inputted color that the user wishes to search for
     */
    async getResults(name: string, color: string): Promise<void> {
        // Clear any current cookies
        let oldCookies = document.cookie.split(";");
        for (let i = 0; i < oldCookies.length; i++) {
            document.cookie = oldCookies[i] + "=;expires="
                + new Date(0).toUTCString();
        }

        // Store search criteria in cookie
        document.cookie = `name=${name}; color=${color}`;
        //console.log("Regular Cookie: " + document.cookie);

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