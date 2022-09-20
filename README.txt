-- Rock paper scissors game --

- Install npm packages with:
"npm install"

- Run program with:
"npm start"

- Test program with:
"npm test"




-- GAMEPLAY WITH POSTMAN --
The following commands can be used.

0: Run: 
- "npm install"
- "npm start"

1. Player 1 sends a request to create a new game and gets back ID from the server.
- Protocol: POST
- Url: http://localhost:8080/api/games/
- Body: {"name":"Harry Potter"}

2. Player 1 sends ID to player 2 via any communication channel. (e.g., mail, slack or fax)
- Copy id form the field "_id"

3. Player 2 joins the game using ID.
- Protocol: POST
- Url http://localhost:8080/api/games/:id/join
- Body: {"name": "Hermione Granger"}

4. Player 1 makes his move (Rock).
- Protocol: POST
- Url http://localhost:8080/api/games/:id/move
- Body: {"name": "Harry Potter","move":"Rock"}

5. Player 2 makes his move (Scissors)
- Protocol: POST
- Url http://localhost:8080/api/games/:id/move
- Body: {"name": "Hermione Granger","move":"Scissors"}

6. Player 1 checks the state of the game and discovers that he has won.
- Protocol: GET
- Url http://localhost:8080/api/games/:id
- Body: {"name": "Harry Potter"}

7. Player 2 checks the state of the game and discovers that he lost.
- Protocol: GET
- Url http://localhost:8080/api/games/:id
- Body: {"name": "Hermione Granger"}