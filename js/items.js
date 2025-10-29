const PLACES = {
	ROOM20: "Pokojíček 2.0",
	KITCHEN: "Kuchyně",
	ROOM: "Pokoj",
	LIVING_ROOM: "Obývák",
	BEDROOM: "Ložnice",
	HALL: "Předsíň",
	BATHROOM: "Koupelna",
	OTHERS: "Ostatní",
};

export const ITEMS = [{
	dimWidth: 2.47,
	dimHeight: 0.95,
	id: "DP20PP",
	place: PLACES.ROOM20,
	title: "Patrová postel"
}, {
	dimWidth: 1.2,
	dimHeight: 0.568,
	id: "DP20S",
	place: PLACES.ROOM20,
	title: "Skříň"
}, {
	dimWidth: 1.2,
	dimHeight: 0.44,
	id: "DP20H",
	place: PLACES.ROOM20,
	title: "Hračky skříň"
}, {
	dimWidth: 0.83,
	dimHeight: 0.58,
	id: "DP20DS",
	place: PLACES.ROOM20,
	title: "Dětský stolek"
}, {
	dimWidth: 0.40,
	dimHeight: 0.28,
	id: "DP20K",
	place: PLACES.ROOM20,
	title: "Knihovna"
}, {
	dimWidth: 1.2,
	dimHeight: 0.8,
	id: "JIS",
	place: PLACES.KITCHEN,
	title: "Jídelní stůl"
}, {
	dimWidth: 0.6,
	dimHeight: 0.7,
	id: "LED",
	place: PLACES.KITCHEN,
	title: "Lednička"
}, {
	dimWidth: 1.2,
	dimHeight: 0.8,
	id: "STP",
	place: PLACES.ROOM,
	title: "Stůl"
}, {
	dimWidth: 0.78,
	dimHeight: 1.20,
	id: "PBP",
	place: PLACES.ROOM,
	title: "Přebalovací pult"
}, {
	dimWidth: 0.65,
	dimHeight: 0.5,
	id: "STO",
	place: PLACES.LIVING_ROOM,
	title: "Konferenční stůl"
}, {
	dimWidth: 0.45,
	dimHeight: 2.8,
	id: "PST",
	place: PLACES.LIVING_ROOM,
	title: "Placatá stěna"
}, {
	dimWidth: 0.8,
	dimHeight: 0.4,
	id: "MSP",
	place: PLACES.ROOM,
	title: "Menší skříň"
}, {
	dimWidth: 2.80,
	dimHeight: 0.56,
	id: "VSP",
	place: PLACES.ROOM,
	title: "Velká skříň"
}, {
	dimWidth: 0.92,
	dimHeight: 0.34,
	id: "LKT",
	place: PLACES.BEDROOM,
	title: "Komoda na TV"
}, {
	dimWidth: 0.4,
	dimHeight: 1.75,
	id: "BOS",
	place: PLACES.HALL,
	title: "Botník, skříně"
}, {
	dimWidth: 0.46,
	dimHeight: 0.42,
	id: "NST",
	place: PLACES.BEDROOM,
	title: "Noční stolek"
}, {
	dimWidth: 2.1,
	dimHeight: 1.8,
	id: "POS",
	place: PLACES.BEDROOM,
	title: "Postel"
}, {
	dimWidth: 1.2,
	dimHeight: 0.4,
	id: "SL1",
	place: PLACES.BEDROOM,
	title: "Malé skříně"
}, {
	dimWidth: 0.65,
	dimHeight: 2,
	id: "SL2",
	place: PLACES.BEDROOM,
	title: "Velká skříň"
}, {
	dimWidth: 0.74,
	dimHeight: 1.7,
	id: "VAN",
	place: PLACES.BATHROOM,
	title: "Vana"
}, {
	dimWidth: 0.7,
	dimHeight: 1.5,
	id: "VA2",
	place: PLACES.BATHROOM,
	title: "Menší vana"
}, {
	dimWidth: 0.6,
	dimHeight: 0.47,
	id: "UMY",
	place: PLACES.BATHROOM,
	title: "Umyvadlo"
}, {
	dimWidth: 0.64,
	dimHeight: 1.23,
	id: "PO2",
	place: PLACES.BEDROOM,
	title: "Postýlka"
}, {
	dimWidth: 0.95,
	dimHeight: 0.43,
	id: "OSS",
	place: PLACES.BEDROOM,
	title: "Osvětlený stůl"
}, {
	dimWidth: 1.4,
	dimHeight: 0.70,
	id: "PUS",
	place: PLACES.BEDROOM,
	title: "Původní stůl"
}, {
	dimWidth: 0.6,
	dimHeight: 0.45,
	id: "PRA",
	place: PLACES.BATHROOM,
	title: "Pračka"
}, {
	dimWidth: 0.6,
	dimHeight: 0.65,
	id: "SUS",
	place: PLACES.HALL,
	title: "Sušička"
}, {
	dimWidth: 0.40,
	dimHeight: 0.65,
	id: "KI4",
	place: PLACES.KITCHEN,
	title: "Dílek kuchyně"
}, {
	dimWidth: 0.60,
	dimHeight: 0.65,
	id: "KI6",
	place: PLACES.KITCHEN,
	title: "Dílek kuchyně"
}, {
	dimWidth: 0.80,
	dimHeight: 0.65,
	id: "KI8",
	place: PLACES.KITCHEN,
	title: "Dílek kuchyně"
}, {
	dimWidth: 0.6,
	dimHeight: 0.65,
	id: "TRO",
	place: PLACES.KITCHEN,
	title: "Trouba"
}, {
	dimWidth: 0.6,
	dimHeight: 0.65,
	id: "MYC",
	place: PLACES.KITCHEN,
	title: "Myčka"
}, {
	dimWidth: 0.6,
	dimHeight: 0.65,
	id: "DRE",
	place: PLACES.KITCHEN,
	title: "Dřez"
}, {
	dimWidth: 0.6,
	dimHeight: 0.65,
	id: "PTS",
	place: PLACES.KITCHEN,
	title: "Potravinová skříň"
}, {
	dimWidth: 0.48,
	dimHeight: 0.53,
	id: "ZID",
	place: PLACES.KITCHEN,
	title: "Židle"
}, {
	dimWidth: 2.7,
	dimHeight: 2,
	dimSideWidth: 1.05,
	dimSideHeight: 1,
	id: "GAU",
	place: PLACES.LIVING_ROOM,
	type: "LRight",
	title: "Gauč"
}, {
	dimWidth: 0.6,
	dimHeight: 1.15,
	id: "KOC",
	place: PLACES.HALL,
	title: "Kočárek"
}, {
	dimWidth: 0.76,
	dimHeight: 0.31,
	id: "SKK",
	place: PLACES.BATHROOM,
	title: "Skříňka",
	url: "https://www.sconto.cz/produkt/vysoka-koupelnova-skrin-pool-bila-vysoky-lesk-414178911"
}, {
	dimWidth: 0.44,
	dimHeight: 0.35,
	id: "KNP",
	place: PLACES.BATHROOM,
	title: "Koš na prádlo",
	url: "https://www.alza.cz/curver-kos-na-spinave-pradlo-infinity-59l-sedy-d5710248.htm"
}, {
	dimWidth: 1.6,
	dimHeight: 0.8,
	id: "DPO",
	place: PLACES.ROOM,
	title: "Dětská postýlka",
	url: "https://www.babynabytek.cz/p/6066-detska-postel-clasic-bila/?utm_source=biano.cz"
}, {
	dimWidth: 2,
	dimHeight: 0.9,
	id: "NPO",
	place: PLACES.ROOM,
	title: "Postel pro jednoho"
}, {
	dimWidth: 1.8,
	dimHeight: 0.8,
	id: "VST",
	place: PLACES.ROOM,
	title: "Velký stůl"
}];

export const DOOR_TYPES = [{
	id: "in",
	title: "Dovnitř"
}, {
	id: "out",
	title: "Ven"
}];

export const DOOR_OPENING = [{
	id: "left",
	title: "Levý pant"
}, {
	id: "right",
	title: "Pravý pant"
}];

export const SIZES = [{
	dimWidth: 0.6,
	id: "60",
	title: "60 cm"
}, {
	dimWidth: 0.7,
	id: "70",
	title: "70 cm"
}, {
	dimWidth: 0.8,
	id: "80",
	title: "80 cm"
}, {
	dimWidth: 0.9,
	id: "90",
	title: "90 cm"
}, {
	dimWidth: 1.0,
	id: "100",
	title: "100 cm"
}];
