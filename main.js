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
	readObjects();
});

IDBRequest.addEventListener("error", () => {
	console.log("Something went wrong!");
});

document.querySelector(".add-btn").addEventListener("click", () => {
	let name = document.getElementById("name").value;

	if (name.length > 0) {
		if (document.querySelector(".save-btn") != undefined) {
			if (confirm("You have unsaved items. ¿Continue anyway?")) {
				addObject({ name });
				readObjects();
			}
		} else {
			addObject({ name });
			readObjects();
		}
	}
});

const addObject = (obj) => {
	const IDBData = getIDBData("readwrite", "Added correctly!");
	IDBData.add(obj);
};

const readObjects = () => {
	const IDBData = getIDBData("readonly");
	const cursor = IDBData.openCursor();
	const $fragment = document.createDocumentFragment();
	document.querySelector(".name-list").innerHTML = "";
	cursor.addEventListener("success", () => {
		if (cursor.result) {
			let el = namesHTML(cursor.result.key, cursor.result.value);
			$fragment.appendChild(el);
			cursor.result.continue();
		} else {
			document.querySelector(".name-list").appendChild($fragment);
		}
	});
};

const modifyObject = (key, obj) => {
	const IDBData = getIDBData("readwrite", "Modified correctly!");
	IDBData.put(obj, key);
};

const deleteObject = (key) => {
	const IDBData = getIDBData("readwrite", "Deleted successfully!");
	IDBData.delete(key);
};

const getIDBData = (mode, msg) => {
	const db = IDBRequest.result;
	const myTransaction = db.transaction("names", mode);
	const objectStore = myTransaction.objectStore("names");
	myTransaction.addEventListener("complete", () => {
		console.log(msg);
	});
	return objectStore;
};

const namesHTML = (id, name) => {
	const $nameItem = document.createElement("div");
	const $h2 = document.createElement("h2");
	const $nameOptions = document.createElement("div");
	const $saveBtn = document.createElement("button");
	const $deleteBtn = document.createElement("button");

	$nameItem.classList.add("name-item");
	$nameOptions.classList.add("name-options");
	$saveBtn.classList.add("save-btn");
	$deleteBtn.classList.add("delete-btn");

	$saveBtn.textContent = "Save";
	$deleteBtn.textContent = "Delete";

	$h2.textContent = name.name;
	$h2.setAttribute("contenteditable", "true");
	$h2.setAttribute("spellcheck", "false");

	$nameOptions.appendChild($saveBtn);
	$nameOptions.appendChild($deleteBtn);

	$nameItem.appendChild($h2);
	$nameItem.appendChild($nameOptions);

	$h2.addEventListener("keyup", () => {
		$saveBtn.classList.replace("desabled-save-btn", "save-btn");
	});

	$saveBtn.addEventListener("click", () => {
		if ($saveBtn.className == "save-btn") {
			modifyObject(id, { name: $h2.textContent });
			$saveBtn.classList.replace("save-btn", "desabled-save-btn");
		}
	});

	$deleteBtn.addEventListener("click", () => {
		deleteObject(id);
		document.querySelector(".name-list").removeChild($nameItem);
	});

	return $nameItem;
};
