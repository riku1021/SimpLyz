import './ButtonTrigger.css';

const ButtonTrigger = ({ drawerOpen, width = '25px', height = '17px', lineHeight = '3px' }) => {
    const buttonStyle = {
        '--btn-width': width,
        '--btn-height': height,
        '--btn-line-height': lineHeight,
    };

    return (
        <section>
            <div
                className={`btn-trigger ${drawerOpen ? 'active' : ''}`}
                style={buttonStyle}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
    );
};

export default ButtonTrigger;
