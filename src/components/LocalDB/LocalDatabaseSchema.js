// Localized UK Crime API Database Schema:
let database = {
    userdata: {},
    fetchcache: {
        dates: [
            {
                key: "2023-2",
                value: "February 2023",
            },
            {
                key: "2023-1",
                value: "January 2023",
            },
            {
                key: "2022-12",
                value: "December 2022",
            },
            {
                key: "2022-11",
                value: "November 2022",
            },
            {
                key: "2022-10",
                value: "October 2022",
            },
            {
                key: "2022-9",
                value: "September 2022",
            },
            {
                key: "2022-8",
                value: "August 2022",
            },
            {
                key: "2022-7",
                value: "July 2022",
            },
            {
                key: "2022-6",
                value: "June 2022",
            },
            {
                key: "2022-5",
                value: "May 2022",
            },
            {
                key: "2022-4",
                value: "April 2022",
            },
            {
                key: "2022-3",
                value: "March 2022",
            },
            {
                key: "2022-2",
                value: "February 2022",
            },
            {
                key: "2022-1",
                value: "January 2022",
            },
            {
                key: "2021-12",
                value: "December 2021",
            },
            {
                key: "2021-11",
                value: "November 2021",
            },
            {
                key: "2021-10",
                value: "October 2021",
            },
            {
                key: "2021-9",
                value: "September 2021",
            },
            {
                key: "2021-8",
                value: "August 2021",
            },
            {
                key: "2021-7",
                value: "July 2021",
            },
            {
                key: "2021-6",
                value: "June 2021",
            },
            {
                key: "2021-5",
                value: "May 2021",
            },
            {
                key: "2021-4",
                value: "April 2021",
            },
            {
                key: "2021-3",
                value: "March 2021",
            },
            {
                key: "2021-2",
                value: "February 2021",
            },
            {
                key: "2021-1",
                value: "January 2021",
            },
            {
                key: "2020-12",
                value: "December 2020",
            },
            {
                key: "2020-11",
                value: "November 2020",
            },
            {
                key: "2020-10",
                value: "October 2020",
            },
            {
                key: "2020-9",
                value: "September 2020",
            },
            {
                key: "2020-8",
                value: "August 2020",
            },
            {
                key: "2020-7",
                value: "July 2020",
            },
            {
                key: "2020-6",
                value: "June 2020",
            },
            {
                key: "2020-5",
                value: "May 2020",
            },
            {
                key: "2020-4",
                value: "April 2020",
            },
            {
                key: "2020-3",
                value: "March 2020",
            },
            {
                key: "2020-2",
                value: "February 2020",
            },
            {
                key: "2020-1",
                value: "January 2020",
            },
            {
                key: "2019-12",
                value: "December 2019",
            },
            {
                key: "2019-11",
                value: "November 2019",
            },
            {
                key: "2019-10",
                value: "October 2019",
            },
            {
                key: "2019-9",
                value: "September 2019",
            },
            {
                key: "2019-8",
                value: "August 2019",
            },
            {
                key: "2019-7",
                value: "July 2019",
            },
            {
                key: "2019-6",
                value: "June 2019",
            },
            {
                key: "2019-5",
                value: "May 2019",
            },
            {
                key: "2019-4",
                value: "April 2019",
            },
            {
                key: "2019-3",
                value: "March 2019",
            },
            {
                key: "2019-2",
                value: "February 2019",
            },
            {
                key: "2019-1",
                value: "January 2019",
            },
            {
                key: "2018-12",
                value: "December 2018",
            },
            {
                key: "2018-11",
                value: "November 2018",
            },
            {
                key: "2018-10",
                value: "October 2018",
            },
            {
                key: "2018-9",
                value: "September 2018",
            },
            {
                key: "2018-8",
                value: "August 2018",
            },
            {
                key: "2018-7",
                value: "July 2018",
            },
            {
                key: "2018-6",
                value: "June 2018",
            },
            {
                key: "2018-5",
                value: "May 2018",
            },
            {
                key: "2018-4",
                value: "April 2018",
            },
            {
                key: "2018-3",
                value: "March 2018",
            },
            {
                key: "2018-2",
                value: "February 2018",
            },
            {
                key: "2018-1",
                value: "January 2018",
            },
            {
                key: "2017-12",
                value: "December 2017",
            },
            {
                key: "2017-11",
                value: "November 2017",
            },
            {
                key: "2017-10",
                value: "October 2017",
            },
            {
                key: "2017-9",
                value: "September 2017",
            },
            {
                key: "2017-8",
                value: "August 2017",
            },
        ],
        categories: [
            {
                url: "all-crime",
                name: "All crime",
            },
            {
                url: "anti-social-behaviour",
                name: "Anti-social behaviour",
            },
            {
                url: "bicycle-theft",
                name: "Bicycle theft",
            },
            {
                url: "burglary",
                name: "Burglary",
            },
            {
                url: "criminal-damage-arson",
                name: "Criminal damage and arson",
            },
            {
                url: "drugs",
                name: "Drugs",
            },
            {
                url: "other-theft",
                name: "Other theft",
            },
            {
                url: "possession-of-weapons",
                name: "Possession of weapons",
            },
            {
                url: "public-order",
                name: "Public order",
            },
            {
                url: "robbery",
                name: "Robbery",
            },
            {
                url: "shoplifting",
                name: "Shoplifting",
            },
            {
                url: "theft-from-the-person",
                name: "Theft from the person",
            },
            {
                url: "vehicle-crime",
                name: "Vehicle crime",
            },
            {
                url: "violent-crime",
                name: "Violence and sexual offences",
            },
            {
                url: "other-crime",
                name: "Other crime",
            },
        ],
        forces: [
            {
                id: "avon-and-somerset",
                name: "Avon and Somerset Constabulary",
                data: {
                    description: "",
                    url: "http://www.leics.police.uk/",
                    engagement_methods: [
                        {
                            url: "http://www.facebook.com/pages/Leicester/Leicestershire-Police/76807881169",
                            description:
                                "Become friends with Leicestershire Constabulary",
                            title: "Facebook",
                        },
                        {
                            url: "http://www.twitter.com/leicspolice",
                            description:
                                "Keep up to date with Leicestershire Constabulary on Twitter",
                            title: "Twitter",
                        },
                        {
                            url: "http://www.youtube.com/leicspolice",
                            description:
                                "See Leicestershire Constabulary's latest videos on YouTube",
                            title: "YouTube",
                        },
                        {
                            url: "http://www.leics.police.uk/rss/",
                            description:
                                "Keep informed with Leicestershire Constabulary's RSS feed",
                            title: "RSS",
                        },
                    ],
                    telephone: "0116 222 2222",
                    id: "leicestershire",
                    name: "Leicestershire Constabulary",
                },
                officers: [],
                // https://data.police.uk/api/${force}/neighbourhoods
                neighborhoods: [
                    {
                        id: "NC04",
                        name: "City Centre",
                        // https://data.police.uk/api/$[force]/${neighborhood_id}
                        data: {
                            id: "NC04",
                            name: "City Centre",
                            url_force:
                                "http://www.leics.police.uk/local-policing/city-centre",
                            contact_details: {
                                twitter:
                                    "http://www.twitter.com/centralleicsNPA",
                                facebook: "http://www.facebook.com/leicspolice",
                                telephone: "101",
                                email: "centralleicester.npa@leicestershire.pnn.police.uk",
                            },
                            links: [
                                {
                                    url: "http://www.leicester.gov.uk/",
                                    description: null,
                                    title: "Leicester City Council",
                                },
                            ],
                            centre: {
                                latitude: "52.6389",
                                longitude: "-1.13619",
                            },
                            // https://data.police.uk/api/leicestershire/NC04/boundary
                            boundary: [
                                {
                                    latitude: "52.6394052587",
                                    longitude: "-1.1458618876",
                                },
                                {
                                    latitude: "52.6389452755",
                                    longitude: "-1.1457057759",
                                },
                                // ...
                                {
                                    latitude: "52.6383706746",
                                    longitude: "-1.1455755443",
                                },
                            ],
                            locations: [
                                {
                                    name: "Mansfield House",
                                    longitude: null,
                                    postcode: "LE1 3GG",
                                    address: "74 Belgrave Gate\n, Leicester",
                                    latitude: null,
                                    type: "station",
                                    description: null,
                                },
                            ],
                            description: "Lorem ipsum",
                            population: "0",
                        },
                    },
                    {
                        id: "NC66",
                        name: "Cultural Quarter",
                    },
                    {
                        id: "NC67",
                        name: "Riverside",
                    },
                    //...
                ],
                // https://data.police.uk/api/crimes-at-location?date=${date}&location_id=${location_id}
                // https://data.police.uk/api/crimes-at-location?date=${date}&lat=${latitude}&lng=${longitude}
                crimereports: {
                    with_location: [
                        {
                            category: "burglary",
                            location_type: "Force",
                            location: {
                                latitude: "51.435384",
                                street: {
                                    id: 1653261,
                                    name: "On or near ",
                                },
                                longitude: "-0.392361",
                            },
                            context: "",
                            outcome_status: {
                                category: "Under investigation",
                                date: "2022-12",
                            },
                            persistent_id:
                                "0844ab0d36d56bf4b533e0c9172e696661a28f7d9ec2feee8d9022d2337a5fa9",
                            id: 107209718,
                            location_subtype: "",
                            month: "2022-12",
                            force_id: "metropolitan",
                            neighborhood: "Hanworth Village",
                        },
                        {
                            category: "drugs",
                            location_type: "Force",
                            location: {
                                latitude: "51.435384",
                                street: {
                                    id: 1653261,
                                    name: "On or near ",
                                },
                                longitude: "-0.392361",
                            },
                            context: "",
                            outcome_status: {
                                category: "Offender given a caution",
                                date: "2022-12",
                            },
                            persistent_id:
                                "4394d32ebf1f3fad5f37190bfa3ffb1f5ab83152aa1c2bb8110147f4055eaceb",
                            id: 107190844,
                            location_subtype: "",
                            month: "2022-12",
                            force_id: "metropolitan",
                            neighborhood: "Hanworth Village",
                        },
                    ],
                    // https://data.police.uk/api/crimes-no-location?category=${category}&force=${force}&date=${date}
                    no_location: [
                        {
                            category: "burglary",
                            persistent_id:
                                "4ea1d4da29bd8b9e362af35cbabb6157149f62b65d37486dffd185a18e1aaadd",
                            location_subtype: "",
                            id: 56862854,
                            location: null,
                            context: "",
                            month: "2017-03",
                            location_type: null,
                            outcome_status: {
                                category:
                                    "Investigation complete; no suspect identified",
                                date: "2017-03",
                            },
                        },
                        {
                            category: "criminal-damage-arson",
                            persistent_id:
                                "979f2338f25f62196268b52c8405ca8ff431fd2fb02ab11b2192c479816547e5",
                            location_subtype: "",
                            id: 56866806,
                            location: null,
                            context: "",
                            month: "2017-03",
                            location_type: null,
                            outcome_status: {
                                category: "Under investigation",
                                date: "2017-03",
                            },
                        },
                        // ...
                    ],
                    // https://data.police.uk/api/outcomes-for-crime/${persistent_id}
                    outcomes: [
                        {
                            crime: {
                                category: "violent-crime",
                                persistent_id:
                                    "590d68b69228a9ff95b675bb4af591b38de561aa03129dc09a03ef34f537588c",
                                location_subtype: "",
                                location_type: "Force",
                                location: {
                                    latitude: "52.639814",
                                    street: {
                                        id: 883235,
                                        name: "On or near Sanvey Gate",
                                    },
                                    longitude: "-1.139118",
                                },
                                context: "",
                                month: "2017-05",
                                id: 56880258,
                            },
                            outcomes: [
                                {
                                    category: {
                                        code: "under-investigation",
                                        name: "Under investigation",
                                    },
                                    date: "2017-05",
                                    person_id: null,
                                },
                                {
                                    category: {
                                        code: "formal-action-not-in-public-interest",
                                        name: "Formal action is not in the public interest",
                                    },
                                    date: "2017-06",
                                    person_id: null,
                                },
                            ],
                        },
                        {
                            outcomes: [
                                {
                                    category: {
                                        code: "under-investigation",
                                        name: "Under investigation",
                                    },
                                    date: "2022-12",
                                    person_id: null,
                                },
                                {
                                    category: {
                                        code: "cautioned",
                                        name: "Offender given a caution",
                                    },
                                    date: "2022-12",
                                    person_id: null,
                                },
                            ],
                            crime: {
                                category: "drugs",
                                location_type: "Force",
                                location: {
                                    latitude: "51.435384",
                                    street: {
                                        id: 1653261,
                                        name: "On or near ",
                                    },
                                    longitude: "-0.392361",
                                },
                                context: "",
                                persistent_id:
                                    "4394d32ebf1f3fad5f37190bfa3ffb1f5ab83152aa1c2bb8110147f4055eaceb",
                                id: 107190844,
                                location_subtype: "",
                                month: "2022-12",
                            },
                        },
                        {
                            outcomes: [
                                {
                                    category: {
                                        code: "under-investigation",
                                        name: "Under investigation",
                                    },
                                    date: "2022-03",
                                    person_id: null,
                                },
                                {
                                    category: {
                                        code: "no-further-action",
                                        name: "Investigation complete; no suspect identified",
                                    },
                                    date: "2022-03",
                                    person_id: null,
                                },
                            ],
                            crime: {
                                category: "burglary",
                                location_type: null,
                                location: null,
                                context: "",
                                persistent_id:
                                    "7c5aa3f2ac7297f252affdb442ff1e6b5970a9b4a538c348d67e2395441f963e",
                                id: 100199945,
                                location_subtype: "",
                                month: "2022-03",
                            },
                        },
                    ],
                    // https://data.police.uk/api/outcomes-at-location?date=${date}&poly=${polygon_coords}
                    // https://data.police.uk/api/outcomes-at-location?date=${date}&lat=${latitude}&lng=-${longitude}
                    // https://data.police.uk/api/outcomes-at-location?date=${date}&location_id=${883498} <= Street ID not Location ID
                    outcomes_at_location: [],
                },
            },
            {
                id: "bedfordshire",
                name: "Bedfordshire Police",
            },
            {
                id: "cambridgeshire",
                name: "Cambridgeshire Constabulary",
            },
            //...
        ],
    },
    queries: [
        {
            id: 0,
            date: "2023-03-04T09:14:37.067Z",
            query: {
                callfunction: "crimes-no-location",
                callvalues: {
                    category: "all_crime",
                    force: "metropolitan",
                    date: "all_dates",
                },
                callArray: [
                    {
                        vars: {
                            date: "2018-2",
                            lat: "51.4405",
                            lng: "-0.100215",
                        },
                        url: "https://data.police.uk/api/crimes-at-location?date=2018-2&lat=51.4405&lng=-0.100215",
                        src: "apiCrimeReportsByLocation",
                        force_id: "metropolitan",
                        neighborhood_name: "West Dulwich",
                        neighborhood_id: "E05014119",
                    },
                    {
                        vars: {
                            date: "2018-1",
                            lat: "51.4405",
                            lng: "-0.100215",
                        },
                        url: "https://data.police.uk/api/crimes-at-location?date=2018-1&lat=51.4405&lng=-0.100215",
                        src: "apiCrimeReportsByLocation",
                        force_id: "metropolitan",
                        neighborhood_name: "West Dulwich",
                        neighborhood_id: "E05014119",
                    },
                    {
                        vars: {
                            date: "2017-12",
                            lat: "51.4405",
                            lng: "-0.100215",
                        },
                        url: "https://data.police.uk/api/crimes-at-location?date=2017-12&lat=51.4405&lng=-0.100215",
                        src: "apiCrimeReportsByLocation",
                        force_id: "metropolitan",
                        neighborhood_name: "West Dulwich",
                        neighborhood_id: "E05014119",
                    },
                    {
                        vars: {
                            date: "2017-11",
                            lat: "51.4405",
                            lng: "-0.100215",
                        },
                        url: "https://data.police.uk/api/crimes-at-location?date=2017-11&lat=51.4405&lng=-0.100215",
                        src: "apiCrimeReportsByLocation",
                        force_id: "metropolitan",
                        neighborhood_name: "West Dulwich",
                        neighborhood_id: "E05014119",
                    },
                    {
                        vars: {
                            date: "2017-10",
                            lat: "51.4405",
                            lng: "-0.100215",
                        },
                        url: "https://data.police.uk/api/crimes-at-location?date=2017-10&lat=51.4405&lng=-0.100215",
                        src: "apiCrimeReportsByLocation",
                        force_id: "metropolitan",
                        neighborhood_name: "West Dulwich",
                        neighborhood_id: "E05014119",
                    },
                    {
                        vars: {
                            date: "2017-9",
                            lat: "51.4405",
                            lng: "-0.100215",
                        },
                        url: "https://data.police.uk/api/crimes-at-location?date=2017-9&lat=51.4405&lng=-0.100215",
                        src: "apiCrimeReportsByLocation",
                        force_id: "metropolitan",
                        neighborhood_name: "West Dulwich",
                        neighborhood_id: "E05014119",
                    },
                    {
                        vars: {
                            date: "2017-8",
                            lat: "51.4405",
                            lng: "-0.100215",
                        },
                        url: "https://data.police.uk/api/crimes-at-location?date=2017-8&lat=51.4405&lng=-0.100215",
                        src: "apiCrimeReportsByLocation",
                        force_id: "metropolitan",
                        neighborhood_name: "West Dulwich",
                        neighborhood_id: "E05014119",
                    },
                ],
            },
            data: {
                results: [],
                errors: [],
            },
        },
    ],
};
