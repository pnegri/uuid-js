# UUID-js

  A js library to generate and parse UUID's, TimeUUID's and generate empty TimeUUID's based on TimeStamp for range selections.

    var UUID = require('uuid-js');

    var aUUID = UUID.new(); // Generate a V4 UUID

    console.log( aUUID.toString() );
    // Prints: 896b677f-fb14-11e0-b14d-d11ca798dbac

    var aTimeUUID = UUID.newTS(); // Generate a V1 TimeUUID
    console.log( aTimeUUID.toString() );

    var today = new Date().getTime();
    var last30days = (new Date().setDate( today.getDate() - 30 )).getTime();

    var rangeStart = UUID.firstUUIDForTime( last30days );
    var rangeEnd = UUID.lastUUIDForTime( today );

    // Example using cassandra
    var query = ...( "select first 50 reversed ?..? from user_twits where key=?", [ rangeStart, rangeEnd, "patricknegri" ]);


## Instalation

  $ npm install uuid-js

## Functions List

  These are avaiable just with require

    UUID.new(); // Generate V4 UUID

    UUID.newTS(); // Generate V1 TimeUUID

    UUID.fromTime( time, last ); // Generate a V1 empty TimeUUID from a Date object (Ex: new Date().getTime() )

    UUID.firstUUIDForTime( time ); // Same as fromTime but first sequence

    UUID.lastUUIDForTime( time ); // Same as fromTime but last sequence

    UUID.fromURN( strId ); // Generate a UUID object from string

    UUID.fromBytes( ints ); // Generate a UUID object from bytes

    UUID.fromBinary( binary ); // Generate a UUID object from binary

## Methods List

  These must be called with a instanced object.

    aUUID.fromParts( timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node );

    aUUID.toString(); // hex string version of UUID

    aUUID.toURN(); // same as hex, but with urn:uuid prefix

    aUUID.toBytes(); // convert to bytes

## Contributors

  This work was based RFC and by the work of these people.

  * LiosK <contact@mail.liosk.net>
  * Gary Dusbabek <gdusbabek@gmail.com>
