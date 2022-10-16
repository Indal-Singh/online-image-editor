const ChooseInput = document.querySelector("#ChooseInput");
const chooseImage = document.querySelector("#chooseImage");
const mainImage = document.querySelector(".img-fluid");
const filterName = document.querySelector(".name");
const inputRange = document.querySelector("#range");
const rangeValue = document.querySelector(".value");
const filterOptionBtn = document.querySelectorAll(".filters .option button");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetBtn = document.querySelector("#reset");
const saveBtn = document.querySelector("#save");


let imageName;
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
filterOptionBtn.forEach(btns => {
    btns.addEventListener('click', () => {
        document.querySelector(".active").classList.remove("active");
        btns.classList.add("active"); //add active class on button click
        filterName.innerText = btns.innerText;
        // console.log(btns.id);
        if (btns.id === 'brightness') {
            inputRange.max = "200";
            inputRange.value = brightness;
            rangeValue.innerText = `${brightness}%`;
        }
        else if (btns.id === 'saturation') {
            inputRange.max = "200";
            inputRange.value = saturation;
            rangeValue.innerText = `${saturation}%`;
        }
        else if (btns.id === 'inversion') {
            inputRange.max = "100";
            inputRange.value = inversion;
            rangeValue.innerText = `${inversion}%`;
        }
        else if (btns.id === 'grayscale') {
            inputRange.max = "100";
            inputRange.value = grayscale;
            rangeValue.innerText = `${grayscale}%`;
        }
    });
})

const applyFilter = () => {
    mainImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    mainImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});
const updateFilter = () => {
    rangeValue.innerText = `${inputRange.value}%`;
    const selectedFilter = document.querySelector(".option .active");

    if (selectedFilter.id === "brightness") {
        brightness = inputRange.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = inputRange.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = inputRange.value;
    } else {
        grayscale = inputRange.value;
    }
    applyFilter();
}
const loadImg = () => {
    let imgURL = ChooseInput.files[0];
    if (!imgURL)
        return; // reture if file not selected
    mainImage.src = URL.createObjectURL(imgURL);
    mainImage.addEventListener('load', () => {
        document.querySelector(".disable").classList.remove('disable');
    })
    inputRange.max = "200";
    resetBtn.click();
    imageName = imgURL.name.replace(/^.*[\\\/]/, '');
};

const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptionBtn[0].click();
    applyFilter();
}
const saveImage = () => {
    saveBtn.innerText = "Saving image...";
    saveBtn.classList.add("disable");
    setTimeout(() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = mainImage.naturalWidth;
        canvas.height = mainImage.naturalHeight;

        ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotate !== 0) {
            ctx.rotate(rotate * Math.PI / 180);
        }
        ctx.scale(flipHorizontal, flipVertical);
        ctx.drawImage(mainImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        const link = document.createElement("a");
        link.download = imageName;
        link.href = canvas.toDataURL();
        link.click();
        saveBtn.innerText = "Save Image";
        saveBtn.classList.remove("disable");
    });
}

ChooseInput.addEventListener('change', loadImg)
inputRange.addEventListener('input', updateFilter)
resetBtn.addEventListener('click', resetFilter)
saveBtn.addEventListener('click', saveImage)
chooseImage.addEventListener('click', () => {
    ChooseInput.click(); // click on input file when choose button click
});