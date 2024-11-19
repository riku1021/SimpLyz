import './ButtonTrigger.css';

interface ButtonTriggerProps {
    drawerOpen: boolean;
    width?: string;
    height?: string;
    lineHeight?: string;
}

const ButtonTrigger: React.FC<ButtonTriggerProps> = ({
    drawerOpen,
    width = '25px',
    height = '17px',
    lineHeight = '3px',
}) => {
    const buttonStyle: React.CSSProperties = {
        '--btn-width': width,
        '--btn-height': height,
        '--btn-line-height': lineHeight,
    } as React.CSSProperties;

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
