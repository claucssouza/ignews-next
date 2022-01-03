import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {

    const users = [
        { id: 1, name: 'Clau'},
        { id: 2, name: 'Xirao'},
        { id: 3, name: 'Ceu'},
    ];
    return response.json(users);
}