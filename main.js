const IDBRequest = indexedDB.open("myDB", 1);
console.log(IDBRequest);

IDBRequest.addEventListener("upgradeneeded", () => {
	console.log("myBb database was successfully created");
	const db = IDBRequest.result;
	db.createObjectStore("names", {
		autoIncrement: true,
	});
});

IDBRequest.addEventListener("success", () => {
	console.log("It´s OK!");
});

IDBRequest.addEventListener("error", () => {
	console.log("Something went wrong!");
});

const addObject = (obj) => {
	const IDBData = getIDBData();
	IDBData[0].add(obj);
	IDBData[1].addEventListener("complete", () => {
		console.log("obj added successfully!");
	});
};

const readObjects = () => {
	const IDBData = getIDBData();
	const cursor = IDBData[0].openCursor();
	const $fragment = document.createDocumentFragment();
	cursor.addEventListener("success", () => {
		if (cursor.result) {
			let el = namesHTML(cursor.result.key, cursor.result.value);
			$fragment.appendChild();
			console.log(cursor.result.value);
			cursor.result.continue();
		} else {
			document.querySelector(".names").appendChild($fragment);
		}
	});
};

const modifyObject = (key, obj) => {
	const IDBData = getIDBData();
	IDBData[0].put(obj, key);
	IDBData[1].addEventListener("complete", () => {
		console.log("obj modified correctly!");
	});
};

const deleteObject = (key) => {
	const IDBData = getIDBData();
	IDBData[0].delete(key);
	IDBData[1].addEventListener("complete", () => {
		console.log("obj deleted successfully!");
	});
};

const getIDBData = () => {
	const db = IDBRequest.result;
	const myTransaction = db.transaction("names", "readwrite");
	const objectStore = myTransaction.objectStore("names");
	return [objectStore, myTransaction];
};

const namesHTML = (id, name) => {
	const $nameItem = document.createElement("div");
	const $h2 = document.createElement("h2");
	const $nameOptions = document.createElement("div");
	const $saveBtn = document.createElement("button");
	const $deleteBtn = document.createElement("button");

	$saveBtn.textContent = "Save";
	$deleteBtn.textContent = "Delete";
	$h2.textContent = name.name;

	$nameItem.classList.add("name-item");
	$nameOptions.classList.add("name-options");
	$saveBtn.classList.add("save-btn");
	$deleteBtn.classList.add("delete-btn");

	$nameOptions.appendChild($saveBtn);
	$nameOptions.appendChild($deleteBtn);

	$nameItem.appendChild($h2);
	$nameItem.appendChild($nameOptions);

	return $nameItem;
};
