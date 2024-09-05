const msgError = (msg, width) => {
    return `<div class="msg warning" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

const msgSuccess = (msg, width) => {
    return `<div class="msg success" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

export { msgError, msgSuccess }
