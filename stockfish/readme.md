# This is stokfish based api to play with machine feature in main app



#### End point

```shell
# The only end pooint i have implementd to get best move for given chess board position 
http://localhost:5123/bestmove

```

### Payload

```js

    payload:{
        fen: string, // fen representaion of chess board
        depth:number; // number between 0 - 25
    }

```

### Response:

```js
data: {
  bestMove: string;
}
// eg  e5e5 for normal move
// eg  e7e8q promotional move  queen promotion
```

### Run API in Ioslatation 

``` 
# Install dependencies
npm install

# Run in dev mode htttp://localhost:5000
npm run dev 

# Run in Production 
npm run start



```
