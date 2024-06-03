Instruktioner
Skapa backend till en webbapplikation för att hantera filmrecensioner. En användare kan registrera sig och väl inloggad så kan hen lämna rescensioner på filmer i databasen.

Designa Mongoose-modeller för Movie, Review, och User med följande fält:

Movie: title, director, releaseYear, genre.
Review: movieId (referens till Movie), userId (referens till User), rating, comment, createdAt.
User: username, email, password, role.
Följande endpoints ska finnas med:

CHECK - POST /movies: Lägg till en ny film.

CHECK - GET /movies: Hämta en lista med alla filmer.

CHECK - GET /movies/:id: Hämta detaljer för en specifik film.

CHECK - PUT /movies/:id: Uppdatera en specifik film.

<!-- ! GLÖM INTE DENNA NEDAN -->

GET /movies/:id/reviews: Hämta alla recensioner för en specifik film. -->

<!-- ! GLÖM INTE DENNA OVAN -->

CHECK - DELETE /movies/:id: Ta bort en specifik film.

CHECK POST /reviews: Lägg till en ny recension.

CHECK GET /reviews: Hämta en lista med alla recensioner.

CHECK GET /reviews/:id: Hämta detaljer för en specifik recension.

CHECK PUT /reviews/:id: Uppdatera en specifik recension.

CHECK DELETE /reviews/:id: Ta bort en specifik recension.

CHECK - POST /register: Registrera en ny användare.

CHECK - POST /login: Logga in en användare

Betygskriterier
För Godkänt:

Uppfyller all funktionalitet enligt ovan
bifoga exempelanrop till alla endpoints (se länk under inlämning)
För Väl Godkänt:

backend följer en MVC-arkitektur (eller motsv.)
Lägg till en endpoint:
GET /movies/ratings: Hämta en lista med alla filmer och deras genomsnittliga betyg.
använd olika roller: user och admin. Alla kan hämta filmer samt läsa/skriva rescensioner men endast admin kan lägga till, uppdatera eller ta bort filmer.
