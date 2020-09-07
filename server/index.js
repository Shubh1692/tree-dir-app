// call all the required packages
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const moment = require('moment');
const cors = require('cors');
const path = require('path');
const nodeResursiveDir = require('node-recursive-directory');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({}));
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const files = {};
/**
 * This api for upload file on given stracture 
 */
app.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }
    const { doc } = req.files;
    const fileExt = doc.name.split('.')[doc.name.split('.').length - 1];
    let filePath = `${moment().format('YYYYMMDDhhmm')}_${req.body.filePath || 'PROJECTNAME_SHOTNAME_TASKNAME'}_${fileExt.toUpperCase()}`;
    await fs.promises.mkdir(`${__dirname}/delivery/${filePath.replace(/_/g, '/')}`, { recursive: true });
    const mainFiles = filePath.split('_').reduce((o, k) => o && o[k] ? o[k] : o[k] = {}, files);
    const newFileName = '0000'.substring(0, '0000'.length - ((Object.keys(mainFiles).length + 1).toString()).length) + ((Object.keys(mainFiles).length + 1).toString());
    mainFiles[newFileName] = true;
    doc.mv(`${__dirname}/delivery/${filePath.replace(/_/g, '/')}/${newFileName}.${fileExt}`,async function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        const paths = await getFiles();
        res.send(paths);
    });
});
/**
 * This api for fetch all uploaded file information from server
 */
app.get('/files', async (req, res) => {
    const paths = await getFiles();
    res.status(200).send(paths)
});

/**
 * This api for show frontend on any api call except contacts
 */
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8000);

/**
 * This method used for get file path
 */

async function getFiles() {
    const paths = {};
    const fileInformation = await nodeResursiveDir(`${__dirname}/delivery`, true); // add true
    fileInformation.forEach(file => {
        console.log(file)
        const filePath = file.filepath.split('/delivery/')[1];
        let count = 0;
        const pathOfObj = filePath.split('/');
        pathOfObj.pop();
        pathOfObj.reduce((a, b) => {
            count++;
            console.log(a, b, a[b])
            if (a[b]) {
                if (count === pathOfObj.length) {
                    a[b] ? '' : a[b] = {};
                    return a[b][file.filename.split('.')[0]] = true;
                }
                return a[b];
            } else {
                if (count === pathOfObj.length) {
                    a[b] ? '' : a[b] = {};
                    return a[b][file.filename.split('.')[0]] = true;
                }
                return a[b] = {};
            }

        }, paths)
    });
    return paths
}