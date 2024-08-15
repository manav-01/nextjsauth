import mongoose from "mongoose";


// DB is take time to process (DB is always in another continently)
export async function connect() {

    try {
        await mongoose.connect(`${process.env.MONGO_URI!}/${process.env.DB_NAME}`);
        const connection = mongoose.connection;

        connection.on("connected", () => { console.log('MongoDB connected successfully'); })
        connection.on("error", (err): void => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        process.exit(1);
    }
}


/*
? NOTES 1

Exit with Codes
The syntax for the process.exit() method in Node.js that ends a running process with an exit code is process.exit(code). The code parameter can be either 0 or 1:
0: Ends the process without failure
1: Ends the process with failure 

?  https://mongoosejs.com/docs/api/connection.html
*/

/*
? NOTE 2 : Handle Type of This

? Method 1:
        if (typeof process.env.MONGO_URI === "string") {
            await mongoose.connect(process.env.MONGO_URI);
        } else {
            await mongoose.connect("3000"); // any thing
            console.log("mongoDB url is not string");
            process.exit(1);
        }

? Method 2:
        await mongoose.connect(process.env.MONGO_URI!); // Type: string | undefined
*/