import { useNavigate } from 'react-router-dom';

const CollectionsList = ({ collections }) => {
    const navigate = useNavigate();

    return (
        <div>
            {collections.map((collection) => (
                <div key={collection._id}>
                    <h3>{collection.name}</h3>
                    <button onClick={() => navigate(`/collections/${collection._id}`)}>View</button>
                </div>
            ))}
        </div>
    );
};

export default CollectionsList;