
async function fetchDigimon(...id) {
    const url = `https://digimon-api.com/api/v1/digimon/${id}`;
    const response = await fetch(url);
    return await response.json()
}

/*
async function indexDigimons (req, res){
    try {
        const primerDgm = 1;    //primer digimon 1
        const ultimoDgm = 1422; //ultimo digimon 1422
        const listaId = []
        const cantidadDigimon = 10
        for (let i = 0; i<=cantidadDigimon ; i++) {
            let id = Math.floor(Math.random() * (ultimoDgm - primerDgm +1)) + primerDgm;
            listaId.push(id);
        }
        
        const digimons = await Promise.all(listaId.map(async (id) => {
            const data = await fetchDigimon(id);
            return {
                id: data.id,
                name: data.name,
                image: data.images[0].href || "none",
                levels: data.levels[0],
                types: data.types[0],
                attributes: data.attributes[0],
                descriptions: data.descriptions
            }
        }));
        
        //console.log(digimons)
        return res.render("digimon/index",{
            title: "Random Digimon Digital Monsters!!",
            layout: "digimon",
            digimons: digimons,
        })
    } catch (error) {
        res.status(500).render("digimon/error",{
            layout: "digimon",
            message: 'Error loading digimons',
            error: error
        })
    }
*/

async function indexDigimons(req, res) {
    try {
        const url = "https://digi-api.com/api/v1/digimon?pageSize=2000"
        const response= await fetch(url)
        const data = await response.json()
        const allDigimons = data["content"]
        const digimons = []
        const maxDigimons = 12
        for( let i = 0; i< maxDigimons; i++){
            const randomIndex = Math.floor(Math.random() * allDigimons.length);
            const randomDigimon = allDigimons[randomIndex];
            digimons.push(randomDigimon)
            allDigimons.splice(randomIndex,1)
        }
        //console.log(digimons)
        return res.render("digimon/index", {
            title: "Random Digimon Digital Monsters!!",
            layout: "digimon",
            digimons: digimons,
        })
    } catch (error) {
        res.status(500).render("digimon/error", {
            layout: "digimon",
            message: 'Error loading digimons',
            error: error
        })
    }
}

async function singleDigimon(req, res) {
    try {
        const id = req.params.id;
        const data = await fetchDigimon(id);

        data.priorEvolutions.map(evolution => {
            const priorEvoId = evolution.id;
            evolution.url = `http://localhost:3000/digimon/${priorEvoId}`
        });

        data.nextEvolutions.map(evolution => {
            const nextEvoId = evolution.id;
            evolution.url = `http://localhost:3000/digimon/${nextEvoId}`
        });
        const digimon = {
            id: data.id,
            name: data.name,
            xAntibody: data.xAntibody,
            image: data.images[0].href,
            levels: data.levels,
            types: data.types,
            fields: data.fields,
            attributes: data.attributes,
            releaseDate: data.releaseDate,
            descriptions: data.descriptions.find(description => description.language === "en_us"),
            skills: data.skills,
            priorEvolutions: data.priorEvolutions,
            nextEvolutions: data.nextEvolutions,
        }
        //console.log(digimon)
        return res.render("digimon/single", {
            title: "Digimon Digital Monsters!!",
            layout: "digimon",
            digimon: digimon,
        })
    } catch (error) {
        res.status(500).render("digimon/error", {
            layout: "digimon",
            message: 'Error loading digimons',
            error: error
        })
    }
}
/* 
async function searchDigimons(req, res) {
    try {
        const { searchTerm } = req.params || null
        console.log(searchTerm)
        if (!searchTerm) {
            return res.status(400).json({
                success:false,
                message: "Search term is required"
            });
        }
        
        const searches = [
            fetch(`https://digi-api.com/api/v1/digimon?name=${searchTerm}&pageSize=2000`),
            fetch(`https://digi-api.com/api/v1/digimon?name=${searchTerm}&exact=true&pageSize=2000`),
            fetch(`https://digi-api.com/api/v1/digimon?attribute=${searchTerm}&pageSize=2000`),
            fetch(`https://digi-api.com/api/v1/digimon?level=${searchTerm}&pageSize=2000`),
        ];

        const response = await Promise.all(searches);
        const results = await Promise.all(response.map(response => response.json()));

        //console.log(results)
        const allDigimons = new Set();

        results.forEach(result => {
            if (result.content) {
                result.content.forEach(digimon => {
                    allDigimons.add(JSON.stringify(digimon))
                })
            }
        })

        console.log(allDigimons)

        return res.status(200).json({
            success: true,
            message: "Digimons found",
            data: [...allDigimons].map(digimon => JSON.parse(digimon))
        })
    } catch (error) {
    
        return res.status(500).json({
            message: "Error loading digimons",
            error: error
        })
        
    }
}
 */
async function getDigimonsByName(req, res) {
    try {
        const name = req.params.name;
        const url = `https://digimon-api.com/api/v1/digimon?name=${name}`;
        const response = await fetch(url);
        const data = await response.json();

        const digimons = data.content.map(digimon => ({
            id: digimon.id,
            name: digimon.name,
            image: digimon.images[0].href || "none",
            levels: digimon.levels[0],
            types: digimon.types[0],
            attributes: digimon.attributes[0]
        }));

        return res.status(200).json({
            success: true,
            count: digimons.length,
            digimons: digimons
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error searching digimons",
            error: error.message
        });
    }
}

async function searchDigimonsV2(req, res) {
    try {
        const { query } = req.query || null;
        console.log(query);
        if (query === null || query === undefined || query === "") {
            return res.render("digimon/search", {
                title: "Search Digimons",
                layout: "digimon",
                digimons: [],
                searchPerformed: false
            });
        }
        

        const searches = [
            fetch(`https://digi-api.com/api/v1/digimon?name=${query}&pageSize=2000`),
            fetch(`https://digi-api.com/api/v1/digimon?name=${query}&exact=true&pageSize=2000`),
            fetch(`https://digi-api.com/api/v1/digimon?attribute=${query}&pageSize=2000`),
            fetch(`https://digi-api.com/api/v1/digimon?level=${query}&pageSize=2000`),
        ];

        const response = await Promise.all(searches);
        const results = await Promise.all(response.map(response => response.json()));

        //console.log(results)
        const allDigimons = new Set();

        results.forEach(result => {
            if (result.content) {
                result.content.forEach(digimon => {
                    allDigimons.add(JSON.stringify(digimon))
                })
            }
        })


        return res.render("digimon/search", {
            title: "Search Results",
            layout: "digimon",
            digimons: [...allDigimons].map(digimon => JSON.parse(digimon)),
            searchPerformed: true,
        });
        
    } catch (error) {
        res.status(500).render("digimon/error", {
            layout: "digimon",
            message: 'Error loading digimons',
            error: error
        });
    }
}

async function aboutUs(req, res) {
    try {
        // ATTRIBUTES
        const attributePromises = []
        for( let i=1; i<=7; i++){
            const url = `https://digi-api.com/api/v1/attribute/${i}`
            attributePromises.push(fetch(url)
                .then(response => response.json())
                .then(data => data)
                .catch(error => console.error(error))
            )}
        const attributes = await Promise.all(attributePromises);

        //LEVELS

        const levelPromises = []
        for (let i=1; i<=9; i++){
            const url = `https://digi-api.com/api/v1/level/${i}`;
            levelPromises.push(fetch (url)
                .then(response => response.json())
                .then(data => data)
                .catch(error => console.error(error))
        )}
        const levels = await Promise.all(levelPromises);
        
        //console.log(attributes)
        return res.render("digimon/about", {
            title: "About Digimon",
            layout: "digimon",
            attributes: attributes,
            levels: levels
        });
    } catch (error) {
        res.status(500).render("digimon/error", {
            layout: "digimon",
            message: 'Error loading about page',
            error: error
        });
    }
}

const DigimonController = {
    indexDigimons,
    singleDigimon,
    searchDigimonsV2,
    getDigimonsByName,
    aboutUs  // Add this line
}

export default DigimonController;