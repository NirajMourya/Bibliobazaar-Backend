import https from 'https'
import querystring from 'querystring'
import { API_BASE_URL } from '../config/config'

const searchService = async (params, callback) => {
    const url = API_BASE_URL + '?' + querystring.stringify(params);
    
    try {
        https.get(url, function (response) {
            if (response.statusCode !== 200) {
                return callback(new Error('Google Books API error. Status Code: ' + response.statusCode));
            }

            let body = '';

            response.on('data', function (data) {
                body += data;
            });

            response.on('end', function () {
                let err, data;
                try {
                    data = JSON.parse(body);
                } catch (e) {
                    err = new Error('Invalid response from Google Books API.');
                }

                if (data && data.error) {
                    callback(new Error(data.error.message));
                } else {
                    callback(err, data);
                }
            });
        }).on('error', function (error) {
            callback(new Error('Failed to fetch from Google Books API: ' + error.message));
        });
    } catch (error) {
        callback(error);
    }
}

export { searchService }