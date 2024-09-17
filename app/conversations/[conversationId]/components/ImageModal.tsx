"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface Props {
  src?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ src, isOpen, onClose }: Props) => {
  if (!src) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="w-96 h-96">
          <Image src={src} alt="Image" fill className="object-cover" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
