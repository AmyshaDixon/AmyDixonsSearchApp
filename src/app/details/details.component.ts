import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class DetailsComponent implements OnInit {
    apiUrl: string = `http://localhost:5000/details/`;
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
            // Connect to the API and retrieve the response
            let response = await fetch(this.apiUrl + id);
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

        // Organizes and add quote content (likes and likes) to an easily accessible array
        for (let likes in quotes) {
            line = "";
            for (let q = 0; q < likes.length; q++) {
                line += quotes[likes][q] + " ";
            }

            this.quotes.push({
                quote: line,
                likes: +likes,
            });
        }
    }
}
