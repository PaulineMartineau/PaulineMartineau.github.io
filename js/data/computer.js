//Simulation ultra simplifier du disque dur de la machine
const computer = {
    elements: [
        {
            type: "directory",
            name: "root",
            elements: [
                {
                    type: "file",
                    name: "identite.txt",
                },
                {
                    type: "directory",
                    name: "doc_officiels",
                    elements: [
                        {
                            type: "file",
                            name: "lettreMotivation.txt",
                        },
                        {
                            type: "file",
                            name: "cv.txt",
                        },
                        {
                            type: "directory",
                            name: "doc_officiels",
                            elements: [
                                {
                                    type: "file",
                                    name: "lettreMotivation.txt",
                                },
                                {
                                    type: "file",
                                    name: "cv.txt",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "directory",
                    name: "jeux",
                    elements: [
                        {
                            type: "game",
                            name: "memory.game",
                        },
                        {
                            type: "game",
                            name: "tetris.game",
                        },
                    ],
                },
                {
                    type: "file",
                    name: "skills.txt",
                },
                {
                    type: "file",
                    name: "lettreMotivation.txt",
                },
            ],
        },
    ]
};