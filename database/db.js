var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "volcanosdb.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE volcano (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            location text,
            history text,          
            active BOOLEAN NOT NULL CHECK (active IN (0, 1))
            )`,
            (err) => {
                if (err) {
                    // Table already created
                    console.log("volcano table exists")
                } else {
                    // Table just created, creating some rows
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO volcano (name, location, history, active) VALUES (?,?,?,?)'
                    db.run(insert, ["Mount Fuji", "Japan", "A perfectly shaped volcano with a conical form and pretty snow-capped peak, Mount Fuji is Japan's most popular and visited tourist attraction", 1])
                    db.run(insert, ["Mauna Loa", "Hawaii", "Situated in the appropriately named Hawaii Volcanoes National Park, Mauna Loa is the world's largest volcano", 1])

                }
            });
    }
});


module.exports = db