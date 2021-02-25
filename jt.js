(function () {

  let _sourceBufferList = []
  let $btnDownload = document.createElement('div')
  let $downloadNum = document.createElement('div')
  let $tenRate = document.createElement('div') // ʮ���ٲ���
  let $oneRate = document.createElement('div') // һ���ٲ���

  // ʮ���ٲ���
  function _tenRatePlay () {
    let $domList = document.getElementsByTagName('video')
    for (let i = 0, length = $domList.length; i < length; i++) {
      const $dom = $domList[i]
      $dom.playbackRate = 10
    }
  }
      // һ���ٲ���
  function _oneRatePlay () {
    let $domList = document.getElementsByTagName('video')
    for (let i = 0, length = $domList.length; i < length; i++) {
      const $dom = $domList[i]
      $dom.playbackRate = 1
    }
  }

  // ������Դ
  function _download () {
    _sourceBufferList.forEach((target) => {
      const mime = target.mime.split(';')[0]
      const type = mime.split('/')[1]
      const fileBlob = new Blob(target.bufferList, { type: mime }) // ����һ��Blob���󣬲������ļ��� MIME ����
      const a = document.createElement('a')
      a.download = `${document.title}.${type}`
      a.href = URL.createObjectURL(fileBlob)
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
  }

  // ������Դȫ��¼ȡ�ɹ�
  let _endOfStream = window.MediaSource.prototype.endOfStream
  window.MediaSource.prototype.endOfStream = function () {
    alert('��Դȫ������ɹ����������أ�')
    _download()
    _endOfStream.call(this)
  }

  // ¼ȡ��Դ
  let _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
  window.MediaSource.prototype.addSourceBuffer = function (mime) {
    console.log(mime)
    let sourceBuffer = _addSourceBuffer.call(this, mime)
    let _append = sourceBuffer.appendBuffer
    let bufferList = []
    _sourceBufferList.push({
      mime,
      bufferList,
    })
    sourceBuffer.appendBuffer = function (buffer) {
      $downloadNum.innerHTML = `�Ѳ��� ${_sourceBufferList[0].bufferList.length} ��Ƭ��`
      bufferList.push(buffer)
      _append.call(this, buffer)
    }
    return sourceBuffer
  }

  // ��Ӳ����� dom
  function _appendDom () {
    const baseStyle = `
      position: fixed;
      top: 50px;
      right: 50px;
      height: 40px;
      padding: 0 20px;
      z-index: 9999;
      color: white;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      line-height: 40px;
      text-align: center;
      border-radius: 4px;
      background-color: #3498db;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    `
    $tenRate.innerHTML = 'ʮ���ٲ���'
    $oneRate.innerHTML = 'һ���ٲ���'
    $downloadNum.innerHTML = '�Ѳ��� 0 ��Ƭ��'
    $btnDownload.innerHTML = '�����Ѳ���Ƭ��'
    $tenRate.style = baseStyle + `top: 150px;`
    $oneRate.style = baseStyle + `top: 200px;`
    $btnDownload.style = baseStyle + `top: 100px;`
    $downloadNum.style = baseStyle
    $btnDownload.addEventListener('click', _download)
    $tenRate.addEventListener('click', _tenRatePlay)
      $oneRate.addEventListener('click', _oneRatePlay)
    document.getElementsByTagName('html')[0].insertBefore($tenRate, document.getElementsByTagName('head')[0]);
      document.getElementsByTagName('html')[0].insertBefore($oneRate, document.getElementsByTagName('head')[0]);
    document.getElementsByTagName('html')[0].insertBefore($downloadNum, document.getElementsByTagName('head')[0]);
    document.getElementsByTagName('html')[0].insertBefore($btnDownload, document.getElementsByTagName('head')[0]);
  }

  _appendDom()
})()
