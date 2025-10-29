import { Decoder, Encoder, Stream, Profile } from '@garmin/fitsdk';
import * as fs from 'fs';
import * as process from 'process';

// STFU!
console.debug = () => {} ; 

/*
 * CURT TODO - moar product IDs
 */ 
const CUSTOM_MANUFACTURER_ID = "garmin"
const CUSTOM_PRODUCT_ID = 3499; // Garmin Legacy Darth Vader
const NEW_PRODUCT_NAME = "GarminFenix69X";

/* 
 * Message mappings
 * CURT TODO - add MOAR
*/ 
const keyToMesgNumMap = {
    'activityMesgs': Profile.MesgNum.ACTIVITY,
    'deviceInfoMesgs': Profile.MesgNum.DEVICE_INFO,
    'deviceSettingsMesgs': Profile.MesgNum.DEVICE_SETTINGS,
    'eventMesgs': Profile.MesgNum.EVENT,
    'fileCreatorMesgs': Profile.MesgNum.FILE_CREATOR,
    'fileIdMesgs': Profile.MesgNum.FILE_ID,
    'lapMesgs': Profile.MesgNum.LAP,
    'recordMesgs': Profile.MesgNum.RECORD,
    'sessionMesgs': Profile.MesgNum.SESSION,
    'setMesgs': Profile.MesgNum.SET,
    'sportMesgs': Profile.MesgNum.SPORT,
    'timeInZoneMesgs': Profile.MesgNum.TIME_IN_ZONE,
    'trainingSettingsMesgs': Profile.MesgNum.TRAINING_SETTINGS,
    'userProfileMesgs': Profile.MesgNum.USER_PROFILE,
    'zonesTargetMesgs': Profile.MesgNum.ZONES_TARGET,
};

/**
 * FIT file modification stuff here
 * @param {string} inputFile Path to the original .FIT file.
 * @param {string} outputFile Path for the modified .FIT file.
 */
async function modifyFitDeviceName(inputFile, outputFile) {
    try {
        console.log(`Reading data from: ${inputFile}`);
        const fileBuffer = fs.readFileSync(inputFile);
        const stream = Stream.fromBuffer(fileBuffer);

        const decoder = new Decoder(stream);
        const { messages, errors } = decoder.read();

        const encoder = new Encoder();

        if (errors.length > 0) {
            console.warn(`Warning: Decoder found ${errors.length} errors.`);
        }

        if (!messages['fileIdMesgs'] || messages['fileIdMesgs'].length === 0) {
            console.error("Error: 'fileId' message not found. Cannot modify device info.");
            return false;
        }

        for (const key in messages) {
            const msgArray = messages[key] || [];
            const mesgNum = keyToMesgNumMap[key]; 

            if (mesgNum === undefined) {
                console.warn(`Skipping unknown message type: ${key}`);
                continue;
            }

            console.debug(`Processing: ${key}`);

            for (const msg of msgArray) {
                
                switch (key) {
                    case 'fileIdMesgs': // I think this is the only important msg to modify ¯\_(ツ)_/¯
                        if ('garminProduct' in msg) {
                            msg.garminProduct = NEW_PRODUCT_NAME;
                            console.debug(`  New garminProduct Name set to: ${msg.garminProduct}`);
                        }
                        if ('manufacturer' in msg) {
                            msg.manufacturer = CUSTOM_MANUFACTURER_ID;
                            console.debug(`  New Manufacturer set to: ${msg.manufacturer}`);
                        }
                        if ('product' in msg) {
                            msg.product = CUSTOM_PRODUCT_ID;
                            console.debug(`  New Product set to: ${msg.product}`);
                        }
                        break; 

                    case 'deviceInfoMesgs': // But maybe this one too idklol
                        if ('garminProduct' in msg) {
                            msg.garminProduct = NEW_PRODUCT_NAME;
                            console.debug(`  New garminProduct set to: ${msg.garminProduct}`);
                        }
                        if ('manufacturer' in msg) {
                            msg.manufacturer = CUSTOM_MANUFACTURER_ID;
                            console.debug(`  New Manufacturer set to: ${msg.manufacturer}`);
                        }
                        if ('product' in msg) {
                            msg.product = CUSTOM_PRODUCT_ID;
                            console.debug(`  New Product set to: ${msg.product}`);
                        }
                        break;

                    default: // dgaf about these ones
                        break;
                }

                encoder.onMesg(mesgNum, msg);
            }
        }

        const uint8Array = encoder.close();
        fs.writeFileSync(outputFile, uint8Array);
        console.log(`Modified FIT file saved to: ${outputFile}`);
        return true;

    } catch (e) {
        console.error(`An error occurred during file processing:`, e);
        return false;
    }
}

const args = process.argv.slice(2);

if (args.length !== 2) {
    const usage = "Usage: node writer.mjs <input_fit_file> <output_fit_file>";
    console.log(usage);
    process.exit(1);
} else {
    const INPUT_FILE = args[0];
    const OUTPUT_FILE = args[1];
    modifyFitDeviceName(INPUT_FILE, OUTPUT_FILE);
}