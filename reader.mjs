import { Decoder, Stream, Profile } from '@garmin/fitsdk';
import * as fs from 'fs';
import * as process from 'process';

async function readFit(inputFile, outputFile) {
    try {
        console.log(`Reading data from: ${inputFile}`);
        const fileBuffer = fs.readFileSync(inputFile);
        const stream = Stream.fromBuffer(fileBuffer);

        const decoder = new Decoder(stream);
        const { messages, errors } = decoder.read();


        if (errors.length > 0) {
            console.warn(`Warning: Decoder found ${errors.length} errors.`);
        }

       console.log("\nCONTENTS:") 
       console.log(JSON.stringify(messages, null, 2))

        return true;

    } catch (e) {
        console.error(`\n[X] An error occurred during file processing:`,e);
        return false;
    }
}

const args = process.argv.slice(2);
const INPUT_FILE = args[0];

if (args.length !== 1) {
    const usage = "Usage: node reader.mjs <input_fit_file>";
    console.log(usage);
    process.exit(1);
} else {
    readFit(INPUT_FILE);
}
