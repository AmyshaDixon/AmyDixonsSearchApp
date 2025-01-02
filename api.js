'use strict';

const data = {
  // id => (name, favorite_color, quotes={"likes": {"quotes": ["q1", ...]}})
  1: ["Mergatroid Q. Finkelmeyer", "red",
      {"100": ["The chicken doesn't need a reason.",
               "When it rains, it pours."],
       "93": ["What goes up must come down.",
              "What goes down must come up."],
      },
     ],
  2: ["Ingrid Wingsproggle", "blue",
      {"73": ["The pen is mightier than the sword.",
              "Actions speak louder than words.",
              "Speak softly, and carry a big stick."],
       "6": ["People who think they know everything" +
             " annoy those of us who do."],
      },
     ],
  3: ["Ilene Dover", "green",
      {"109": ["Fools rush in where angels fear to tread.",
               "Nothing ventured, nothing gained.",
               "No pain, no gain."],
      }
     ],
  4: ["Lou D. Mouth", "blue", {}],
  5: ["Vishwanath Subramanayam", "red",
      {
        "42619": ["Too many cooks spoil the broth.",
                  "Many hands make light work."],
        "1": ["In the land of the blind, the one-eyed woman is queen."],
      }
     ],
  12: ["Jack Spratt", "green",
       {
         "146": ["The other quote is false.",
                 "The other quote is false."],
         "143": ["I never said that."],
         "1502": ["Wherever you go, there you are."],
       }
      ],
  19: ["Rosita Nuñez", "red",
       {
         "152": ["If you knock down the great wall of china," +
                 " you will have to sweep up all the broken china",
                 "No one has ever heard of the great wall of ceramic."],
         "2": ["If a tree fell in the forest and no one was there to" +
               " hear it, did it really fall?"],
       }
      ],
  20: ["Xhao Xin", "green",
       {
         "200": ["X marks the spot"],
         "30": ["If I told you once, I told you once.",
                "Oily to bed and oily to rise makes you greasy."],
         "4": ["Little things come in small packages.",
               "Nothing worth having is easy.",
               "That sneeze is stronger than a bee's knees" +
               " in a stiff breeze."],
         "1926": ["Would would life be like if 12 were a prime number?",
                  "I'm sure I put my keys right over there.",
                  "Listen more, speak less."],
       }
      ],
    21: ["Turnip Dixon", "blue",
        {
            "999": ["Boof"],
            "174": ["Baroof ruff rooof"],
            "5498": ["woofen"],
        }
    ],
}

// Configure the secure express server
const express = require('express');
let app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Pass to next layer of middleware
  next();
});

app.get('/search', (req, res) => {
  let term = req.query.term;
  let color = req.query.color;
  if (term === undefined && color === undefined) {
    res.status(400).json(
      {'error': 'at least one parameter of term or color is required'});
    return;
  }
  if (term !== undefined) {
    term = term.toLowerCase();
  }
  if (color !== undefined) {
    color = color.toLowerCase();
  }

  let matches = [];
  for (const [id, person] of Object.entries(data)) {
    let match = false
    if (term !== undefined) {
      if (person[0].toLowerCase().includes(term) &&
          ((color === undefined) || (person[1].toLowerCase().includes(color))))
      {
        match = true;
      }
    } else if ((color !== undefined) &&
               (person[1].toLowerCase().includes(color))) {
      match = true;
    }
    if (match) {
      matches.push({'id': id, 'name': person[0]})
    }
  }
  res.status(200).json({'matches': matches});
});

app.get('/details/:id', (req, res) => {
  let person = parseInt(req.params.id);
  if (isNaN(person)) {
    res.status(400).json({'error': 'id must be numeric'});
    return;
  }
  let record = data[person];
  if (record === undefined) {
    res.status(404).json({'error': 'person not found'});
    return;
  }
  res.status(200).json({
    'id': person,
    'name': record[0],
    'favorite_color': record[1],
    'quotes': record[2],
  });
});

app.get('*', (req, res) => {
  console.log(req.id);
  res.status(400).json({'error': 'invalid request'});
});

app.use((err, req, res, next) => {
  console.log('[ERROR]', err);
  res.status(500).send('Server error occurred');
});

app.listen(5000, () => {
  console.log('Backend started at: http://localhost:5000');
});
