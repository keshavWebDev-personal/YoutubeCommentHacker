export function rangeSliders() {
    const DOMElems = {
        progress: document.getElementById('progress'),
        rangeSliders: document.querySelectorAll('.range-input_Countainer input'),
        sliderValue_popups: document.querySelectorAll('.sliderValue_popup'),
        sliderContainer: document.getElementById('range-input_Countainer')
    }

    const DOMElems_Methods = {
        getSliderRectifiedValue: function (sliderVal, sliderThumb_width) {
            let sliderWidth = document.getElementById('range-input_Countainer').offsetWidth
            return Math.round((((sliderVal) + ((sliderThumb_width / sliderWidth) * 100)) * ((sliderWidth - (sliderThumb_width)) / sliderWidth)) - (sliderThumb_width / 2)) + "%"
        }
    }
    
    const someVariables = {
        minDistanceBtwThumbs: 17
    }
    //For initial Slider popup Position and textContent setting
    DOMElems.sliderValue_popups[0].style.left = DOMElems_Methods.getSliderRectifiedValue(parseInt(DOMElems.rangeSliders[0].value), 20)
    DOMElems.sliderValue_popups[1].style.left = DOMElems_Methods.getSliderRectifiedValue(parseInt(DOMElems.rangeSliders[1].value), 20)
    DOMElems.sliderValue_popups[0].textContent = DOMElems.rangeSliders[0].value
    DOMElems.sliderValue_popups[1].textContent = DOMElems.rangeSliders[1].value

    //For Sider Thumb Movement
    DOMElems.rangeSliders.forEach(slider => {
        slider.addEventListener('input', slider => {
            let minVal = parseInt(DOMElems.rangeSliders[0].value)
            let maxVal = parseInt(DOMElems.rangeSliders[1].value)

            if (slider.target.id == 'maxTimeSlider') {
                if (maxVal - someVariables.minDistanceBtwThumbs < 0) {
                    DOMElems.rangeSliders[1].value = someVariables.minDistanceBtwThumbs

                } else {
                    if (maxVal - someVariables.minDistanceBtwThumbs < minVal) {
                        DOMElems.rangeSliders[0].value = maxVal - someVariables.minDistanceBtwThumbs
                        DOMElems.progress.style.left = maxVal - someVariables.minDistanceBtwThumbs + "%"
                        DOMElems.sliderValue_popups[0].textContent = maxVal -someVariables.minDistanceBtwThumbs
                        DOMElems.sliderValue_popups[0].style.left = DOMElems_Methods.getSliderRectifiedValue(maxVal -someVariables.minDistanceBtwThumbs , 20)
                    }
                    DOMElems.progress.style.right = (100 - maxVal) + "%"

                    DOMElems.sliderValue_popups[1].style.left = DOMElems_Methods.getSliderRectifiedValue(maxVal, 20)
                    DOMElems.sliderValue_popups[1].textContent = maxVal
                }

            } else if (slider.target.id == 'minTimeSlider') {
                if (minVal + someVariables.minDistanceBtwThumbs > 100) {
                    DOMElems.rangeSliders[0].value = 100 - someVariables.minDistanceBtwThumbs
                } else {
                    if (minVal + someVariables.minDistanceBtwThumbs > maxVal) {
                        DOMElems.rangeSliders[1].value = minVal + someVariables.minDistanceBtwThumbs
                        DOMElems.progress.style.right = (100 - (minVal + someVariables.minDistanceBtwThumbs)) + "%"
                        DOMElems.sliderValue_popups[1].textContent = minVal + someVariables.minDistanceBtwThumbs
                        DOMElems.sliderValue_popups[1].style.left = DOMElems_Methods.getSliderRectifiedValue(minVal +someVariables.minDistanceBtwThumbs , 20)
                        
                    }
                    DOMElems.progress.style.left = minVal + "%"

                    DOMElems.sliderValue_popups[0].style.left = DOMElems_Methods.getSliderRectifiedValue(minVal, 20)
                    DOMElems.sliderValue_popups[0].textContent = minVal

                }
            }
        })
    });

    //Animating Slider Value Popups
    DOMElems.sliderContainer.onmouseenter = (e) => {
        DOMElems.sliderValue_popups[0].style.opacity = 1
        DOMElems.sliderValue_popups[0].style.translate = '0'
        DOMElems.sliderValue_popups[1].style.opacity = 1
        DOMElems.sliderValue_popups[1].style.translate = '0'
    }
    DOMElems.sliderContainer.onmouseleave = (e) => {
        DOMElems.sliderValue_popups[0].style.opacity = 0
        DOMElems.sliderValue_popups[0].style.translate = '0 10px'
        DOMElems.sliderValue_popups[1].style.opacity = 0
        DOMElems.sliderValue_popups[1].style.translate = '0 10px'
    }
}