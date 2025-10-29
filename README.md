# FitKit

Quick and dirty toolkit to read and write (ProductIDs) to Garmin FIT files. Uses Garmin's `fitsdk`. 

## Setup
Requires Node.js and npm. 

### Install Dependencies 
```
npm install 
```

### Usage

#### Finding a .FIT 
Plug your Garmin via USB into the family PC and start pilfering. Works on Windows 11; not tested on Gentoo or TempleOS.  

Or harass your strava friends for their precious data. 

#### Read .FIT File 
Dumps a big 'ol JSON blob to STDOUT. 
```
node reader.mjs [INPUT.fit]
```

#### Write Dummy ProductID to .FIT File
Tampers with the .FIT file and sets a hardcoded (for now) ProductID value.
```
node writer.mjs [INPUT.fit] [OUTPUT.fit]
```