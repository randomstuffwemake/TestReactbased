let port, writer, reader;

export async function connectSerial() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();

        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        writer = textEncoder.writable.getWriter();

        // Example of writing to the port
        const data = new TextEncoder().encode('Your message here');
        await writer.write(data);

        // Example of reading from the port
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                // Reader has been canceled.
                break;
            }
            console.log(new TextDecoder().decode(value));
        }
    } catch (e) {
        console.error('Error connecting to the serial device:', e);
    }
}

export async function sendSerialData(data) {
    try {
        await writer.write(data);
    } catch (e) {
        console.error('Error sending data:', e);
    }
}

export async function readSerialData() {
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                // Reader stream is closed
                break;
            }
            console.log(value); // Handle the incoming data
        }
    } catch (e) {
        console.error('Error reading data:', e);
    }
}