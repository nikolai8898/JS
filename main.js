let SQR = 20
let x = 30
    numb = 1
    win = []
	currentWIN = []
	XY = []
    diffScale = 1
	colorsBackCur = []
    colorsBack = []
	currentColor = ''
	cur = []
    currentWidth = 500
    currentY = 0
    currentX = 0
	
    const oCanvas = document.getElementById('cnv')
    cntxCanvas = oCanvas.getContext('2d')
    let img = new Image()
    const input = document.getElementById('file-input')
    

input.onchange = function chooseFile() {
    img.src = ''
    itsNull()
    btnLock('left')
    btnLock('right')
    btnLock('top')
    btnLock('bottom')
    btnLock('dist')
    btnLock('appr')
    const btn = document.getElementById('open')
    btn.style.display = 'none'
    let inputValue = input.value
    let arrValue = inputValue.split('\\')
    img.src = `${arrValue[2]}`
    window.cnv.appendChild(img)
    img.onload = game
}

function itsNull() {
    x = 30
    numb = 1
    win = []
	currentWIN = []
	XY = []
	colorsBackCur = []
    colorsBack = []
	currentColor = ''
	cur = []
    cntxCanvas.clearRect(0,0, 500, 500)
}
function game() {
    if (this.width >= this.height) {
        let currentSize = (this.width / this.height) * 500
        cntxCanvas.drawImage(img, 0, 0, 500, currentSize)
    } else {
        let currentSize = (this.height / this.width) * 500
        cntxCanvas.drawImage(img, 0, 0, currentSize, 500)
    }
    for (let j = 0; j < (currentWidth / SQR); j++) {
        for (let i = 0; i < (currentWidth / SQR); i++) {
            let idSample = cntxCanvas.getImageData(i*SQR + (SQR/2), j*SQR  + (SQR/2), 1, 1).data
            win.push({rgba : `rgba(${idSample[0]}, ${idSample[1]}, ${idSample[2]}, ${idSample[3]})`,R : `${idSample[0]}`, G: `${idSample[1]}`, B: `${idSample[2]}`, a: `${idSample[3]}`, xy : `${i * SQR}:${j * SQR}`, x: `${i * SQR}`, y : `${j * SQR}`, numb: 0})
            }
        }
    CIE76()
    win.forEach(coord =>{
        cur.push (coord.rgba)
        currentWIN.push({x: coord.x, y: coord.y, xy: coord.xy, rgba: '', R: coord.R, G: coord.G, B: coord.B, a: coord.a})
    })
    for (let index = 0; index < cur.length; index++) {
        const element = cur[index];
        if (colorsBackCur.includes(element) === false) {
            colorsBackCur.push(element)
        }
    }
    colorsBackCur.forEach(coord => {
        colorsBack.push({rgba: coord, numb: numb})
        numb++
    })
	colorsPack()
    win.forEach(coord => {
        const indexCurrent = colorsBack.findIndex(element => element.rgba === coord.rgba)
        coord.numb = colorsBack[indexCurrent].numb
    })
    paintPicture()
    getGray()
    paintRect()
}
function CIE76() {
    for (let index = 0; index < win.length; index++) {
        const element = win[index];
        for (let index2 = 0; index2 < win.length; index2++) {
            const coord = win[index2];
            let x2 = Math.sqrt(Math.pow((+coord.R - +element.R), 2) + Math.pow((+coord.G - +element.G), 2) + Math.pow((+coord.B - +element.B), 2))
            if (x2 < 45) {
                element.rgba = `rgba(${coord.R}, ${coord.G}, ${coord.B}, 1)`
                element.R = coord.R
                element.G = coord.G
                element.B = coord.B
            }
        }	
    }
}
function colorsPack() {
    colorsBack.forEach((coord) => {
		const element = document.createElement('div')
		element.style.width = `30px`
		element.style.height = `30px`
		element.style.position = 'absolute'
		element.style.top = `600px`
		element.style.left = `${x}px`
		x = x + 40
		element.style.backgroundColor = coord.rgba
		element.id = coord.rgba
		element.style.border = '1px solid black'
		element.style.boxSizing = 'border-box'
		element.innerHTML = `${coord.numb}`
		element.style.fontSize = '50%'
        element.style.textShadow = '2px 2px 0 #ccc'
		element.style.textAlign = 'center'
        element.style.cursor = 'pointer'
        element.style.boxShadow = '0 0 5px #666'
		element.onclick = colorPicked
		window.contend.appendChild(element)	
	})
}
function paintPicture() {
    win.forEach( coord => {
        cntxCanvas.fillStyle = `${coord.rgba}`
        cntxCanvas.fillRect(+coord.x + currentX, +coord.y + currentY, SQR, SQR)
    })
}
function paintRect() {
    win.forEach(coord => {
        cntxCanvas.strokeStyle = '#fff'
		cntxCanvas.strokeRect(+coord.x + currentX, +coord.y + currentY, SQR, SQR)
        cntxCanvas.fillStyle = '#000'
        cntxCanvas.textBaseline = 'center'
        cntxCanvas.font = `normal ${SQR/2}px Arial`
        cntxCanvas.fillText(`${coord.numb}`, +coord.x + SQR * 0.4 + currentX, +coord.y + SQR * 0.75 + currentY)
    })
}
function colorPicked(element) {
    const result = win.filter(coord => coord.rgba === element.originalTarget.id)
    win.forEach(coord => {
        cntxCanvas.strokeStyle = '#fff'
		cntxCanvas.strokeRect(+coord.x + currentX, +coord.y + currentY, SQR, SQR)
    })
    result.forEach(coord => {
        cntxCanvas.strokeStyle = '#000'
		cntxCanvas.strokeRect(+coord.x + currentX, +coord.y + currentY, SQR, SQR)
    })
    currentColor = element.originalTarget.id
    cnv.onclick = paintedBlock
    cnv.onmousedown = startPainted
    cnv.onmouseup = endPainted
}
function startPainted() {
    cnv.addEventListener('mousemove', paintedBlock)
}
function endPainted() {
    cnv.removeEventListener('mousemove', paintedBlock)
}
function getGray() {
    let Sample = cntxCanvas.getImageData(0, 0, currentWidth, currentWidth)
    data = Sample.data
    for (let index = 0; index < data.length; index++) {
        let	 avg = (data[index] + data[index + 1] + data[index + 2]) / 4
        data[index]     = avg; // red
        data[index + 1] = avg; // green
        data[index + 2] = avg; // blue
    }
    cntxCanvas.putImageData(Sample, 0, 0)
    currentWIN.forEach(coord => {
        if (coord.rgba !== '') {
            cntxCanvas.fillStyle = `${coord.rgba}`
            cntxCanvas.fillRect(+coord.x + currentX, +coord.y + currentY, SQR, SQR)
        }
    })
}
function paintedBlock(element) {
    let x = Math.round(element.layerX / (diffScale *SQR)) * SQR - SQR
    y = Math.round(element.layerY / (diffScale *SQR)) * SQR - SQR
    console.log(x, y, x - currentX, y - currentY);
    indexWIN = win.findIndex(coord => coord.xy === `${x - currentX}:${y - currentY}`)
    index = win.findIndex(coord => coord.xy === `${x}:${y}`)
    if (index !== -1 && indexWIN !== -1) {
        cntxCanvas.fillStyle = `${currentColor}`
        cntxCanvas.fillRect(win[index].x, win[index].y, SQR, SQR)
        let currentIndex = currentWIN.findIndex(coord => coord.xy === `${x - currentX}:${y - currentY}`)
        currentWIN[currentIndex].rgba = currentColor
        if (win[indexWIN].rgba === currentWIN[currentIndex].rgba) {
            win.splice(indexWIN, 1)
        } else {
            cntxCanvas.strokeStyle = '#fff'
            cntxCanvas.strokeRect(win[indexWIN].x + currentX, win[indexWIN].y + currentY, SQR, SQR)
            cntxCanvas.fillStyle = '#000'
            cntxCanvas.textBaseline = 'center'
            cntxCanvas.font = `normal ${SQR/2}px Arial`
            cntxCanvas.fillText(`${win[indexWIN].numb}`, +win[indexWIN].x + SQR * 0.4 + currentX,  +win[indexWIN].y + SQR * 0.75 + currentY)
        }
        const indexNumb = win.filter(coord => coord.rgba === currentWIN[currentIndex].rgba)
        if (indexNumb.length === 0) {
            const element = document.getElementById(currentWIN[currentIndex].rgba)
            element.style.display = 'none'
        }
        if (win.length === 0) {alert('ты выиграл что-то ценное')}
        sessionStorage.setItem(currentWIN[currentIndex].xy, currentWIN[currentIndex].rgba)
    }
}
function approximation() {
    cntxCanvas.clearRect(currentX, currentY, currentWidth, currentWidth)
    diffScale *= 2
    if (diffScale > 2) {
        diffScale = 2
    } else {cntxCanvas.scale(2,2)}
    cntxCanvas.drawImage(img, currentX, currentY, 500, 500)
    paintPicture()
    getGray()
    paintRect()
}
function btnLock(btnID) {
    const btn = document.getElementById(`${btnID}`)
    btn.style.display = 'inline-block'
}
function distancing() {
    cntxCanvas.clearRect(currentX, currentY, currentWidth, currentWidth)
    diffScale *= 0.5
    cntxCanvas.scale(0.5, 0.5)
    cntxCanvas.drawImage(img, currentX, currentY, 500, 500)
    paintPicture()
    getGray()
    paintRect()
}
function moveRight() {
    cntxCanvas.clearRect(currentX, currentY, currentWidth, currentWidth)
    currentX = currentX - 2*SQR
    currentX < -(currentWidth * 10 / SQR) ? currentX = -(currentWidth * 10 / SQR) : {}
    cntxCanvas.drawImage(img, currentX, currentY, currentWidth, currentWidth)
    paintPicture()
    getGray()
    paintRect()
}
function moveLeft() {
    cntxCanvas.clearRect(currentX, currentY, currentWidth, currentWidth)
    currentX = currentX + 2*SQR
    currentX > 0 ? currentX = 0 : {}
    cntxCanvas.drawImage(img, currentX, currentY, currentWidth, currentWidth)
    paintPicture()
    getGray()
    paintRect()
}
function moveBottom() {
    cntxCanvas.clearRect(currentX, currentY, currentWidth, currentWidth)
    currentY = currentY - 2*SQR
    currentY < -(currentWidth * 10 / SQR) ? currentY = -(currentWidth * 10 / SQR) : {}
    cntxCanvas.drawImage(img, currentX, currentY, currentWidth, currentWidth)
    paintPicture()
    getGray()
    paintRect()
}
function moveTop() {
    cntxCanvas.clearRect(currentX, currentY, currentWidth, currentWidth)
    currentY = currentY + 2*SQR
    currentY > 0 ? currentY = 0 : {}
    cntxCanvas.drawImage(img, currentX, currentY, currentWidth, currentWidth)
    paintPicture()
    getGray()
    paintRect()
}
