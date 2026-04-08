import { motion } from 'motion/react';

const LOADING_MESSAGE = 'INITIALIZING NEURAL NETWORK.';

interface LoadingScreenProps {
  visible: boolean;
  closing: boolean;
}

export function LoadingScreen({ visible, closing }: LoadingScreenProps) {

  if (!visible) {
    return null;
  }

  return (
    <div className={`loading-screen fixed inset-0 z-[120] flex items-center justify-center ${closing ? 'loading-screen-closing' : ''}`}>
      <div className="loading-grid absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="loading-card relative mx-4 w-full max-w-2xl rounded-2xl border px-8 py-10 shadow-2xl"
      >
        <div className="loading-glow absolute -inset-px rounded-2xl" />
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="loading-status text-center"
          >
            {LOADING_MESSAGE}
          </motion.p>

          <div className="mt-8">
            <div className="loading-progress-track h-2 w-full overflow-hidden rounded-full">
              <motion.div
                className="loading-progress-fill h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.4, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
