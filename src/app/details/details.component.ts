import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class DetailsComponent implements OnInit {
    apiUrl: string = "http://localhost:5000/details/";
    details: string[] = [];
    quotes: {quote: string, likes: number}[] = [];
    apiError: string = "";

  constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        let id = "";

        // Accept the ID from the search page
        this.route.params.subscribe((params) => {
            id = params.id;
        });

        this.pullDetails(id);
    }

    /**
     * Connects to and pulls data from the details/{id} API response
     * @param id - The ID of the person to look up taken from the search/? API response
     * @returns - None
     */
    async pullDetails(id: string): Promise<any> {
        try {
            // Retrieve response
            let response = await fetch(this.apiUrl + id);

            // Handle direct API code errors
            switch (response.status) {
                case 400:
                    this.apiError = "The API has returned the following error: [ 400: The provided ID must be"
                        + " numeric]. We apologize for the inconvienience."
                    break;
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

            // Store details
            this.details = [outcome.name, outcome.favorite_color];

            this.storeQuotes(outcome.quotes);
        }
        catch (error) {
            this.apiError = `The API has returned the following error: [ ${error} ]. We apologize for the inconvienience.`
        }
    }

    /**
     * Organizes the quotes portion of the details/{id} API response into
     * an array that is easier to traverse; quotes no longer have multiple index enteries
     * @param quotes - The entire quotes section of the details/id API response
     * @returns - None
     */
    storeQuotes(quotes: any) {
        // If there are no quotes, cease operation
        if (!quotes) {
            return;
        }

        let line: string = "";

        console.log(quotes);

        // Organizes and add quote content (likes and likes) to an easily accessible array
        for (let likes in quotes) {
            line = "";
            for (let q = 0; q < likes.length; q++) {
                line += quotes[likes][q] + "  ";
            }

            this.quotes.push({
                // NOTE: Did a small patch for "undefined," for now,
                // but source of issue needs to be resolved when there is more time
                quote: line.replace(/undefined/g, ""),
                likes: +likes,
            });
        }

        // Sort quotes by likes (desc) and then aplphabetically (asc)
        // Not sure if I am interpreting this correctly...
        this.quotes.sort((a, b) => +b.quote - +a.quote); // Organizing alphabetically first
        this.quotes.sort((a, b) => b.likes - a.likes); // so that the main order will be by likes

        console.log(this.quotes);
    }
}
