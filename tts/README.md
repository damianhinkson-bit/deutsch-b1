# Offline German voice for "Save as MP3"

Downloaded by the app the first time you save an MP3 (about 75 MB), kept in its own cache, then used offline.

- `thorsten.onnx` / `.json`: Piper voice de_DE-thorsten-medium (Thorsten-Voice, CC0), via sherpa-onnx tts-models release
- `ort.wasm.min.js`, `ort-wasm-simd.wasm`: onnxruntime-web 1.18.0 (MIT)
- `piper_phonemize.*`: @diffusionstudio/piper-wasm 1.0.0 (piper-phonemize MIT, espeak-ng GPL-3.0); the data file is repacked with the German dictionary only
- `lamejs.js`: @breezystack/lamejs 1.2.7 (LGPL-3.0)
