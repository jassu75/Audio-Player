export interface MessageModalProps {
    open: boolean;
    onClose: () => void;
    message: string;
    messageTitle: string;
}
