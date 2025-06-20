import React, { useState } from 'react';

const LostFound = () => {
    const [itemType, setItemType] = useState('');
    const [itemPlace, setItemPlace] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Item Type:', itemType);
        console.log('Item Place:', itemPlace);
        console.log('Date:', date);
    };

    return (
        <div className="lost-found row d-flex justify-content-center">
            <div className='col-12'>
                <h2>Lost or Found Item</h2>
            </div>
            <div className='col-6 text-start'>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="itemType">Item Type</label>
                        <input
                            type="text"
                            className="form-control"
                            id="itemType"
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemPlace">Item Place</label>
                        <input
                            type="text"
                            className="form-control"
                            id="itemPlace"
                            value={itemPlace}
                            onChange={(e) => setItemPlace(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LostFound;