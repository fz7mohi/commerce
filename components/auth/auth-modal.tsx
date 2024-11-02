// File: components/auth/auth-modal.tsx
'use client';

import { Button, Chip, Modal, ModalBody, ModalContent, Tab, Tabs } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaShopify } from 'react-icons/fa';
import { RegisterForm, SignInForm } from './auth-forms';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'sign-in' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'sign-in' }: AuthModalProps) {
  const [selectedTab, setSelectedTab] = useState<'sign-in' | 'register'>(defaultTab);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
      classNames={{
        base: 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md backdrop-saturate-150 border border-white/20 dark:border-neutral-800/20 shadow-xl',
        backdrop: 'bg-neutral-900/50 backdrop-blur-sm backdrop-saturate-150',
        body: 'p-0',
        closeButton: 'hover:bg-white/10 active:bg-white/20'
      }}
    >
      <ModalContent>
        {(onClose) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ModalBody>
              <div className="flex flex-col md:flex-row">
                {/* Left side - Branding/Image */}
                <div className="relative hidden md:flex md:w-1/2">
                  <div className="absolute inset-0 rounded-l-lg bg-gradient-to-br from-primary/90 to-primary-dark/90 backdrop-blur-sm" />
                  <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
                    <div className="rounded-lg bg-white/5 p-6 backdrop-blur-sm">
                      <h2 className="mb-4 text-2xl font-bold">Welcome to Gemspe</h2>
                      <p className="text-sm opacity-90">
                        Join our community of shoppers and discover unique products.
                      </p>
                    </div>
                    <div className="space-y-4 rounded-lg bg-white/5 p-6 backdrop-blur-sm">
                      <div className="flex flex-col gap-2">
                        {['Smart Shopping', 'Community Driven', 'Exclusive Deals'].map(
                          (feature) => (
                            <div key={feature} className="flex items-center gap-2">
                              <Chip
                                size="sm"
                                variant="flat"
                                classNames={{
                                  base: 'bg-white/20 backdrop-blur-md border-white/30',
                                  content: 'text-white font-medium'
                                }}
                              >
                                {feature}
                              </Chip>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Auth Forms */}
                <div className="bg-white/50 p-6 backdrop-blur-md dark:bg-neutral-900/50 md:w-1/2">
                  <div className="mb-6 md:hidden">
                    <h2 className="text-xl font-bold">Welcome to Gemspe</h2>
                    <p className="text-sm text-neutral-500">
                      Sign in to your account or create a new one.
                    </p>
                  </div>

                  <Tabs
                    selectedKey={selectedTab}
                    onSelectionChange={(key) => setSelectedTab(key as 'sign-in' | 'register')}
                    variant="underlined"
                    classNames={{
                      tab: 'h-12',
                      tabList: 'gap-6',
                      cursor: 'bg-primary',
                      tabContent: 'group-data-[selected=true]:text-primary'
                    }}
                    aria-label="Auth options"
                  >
                    <Tab
                      key="sign-in"
                      title={
                        <div className="flex flex-col gap-1">
                          <span>Sign In</span>
                          <span className="text-xs text-neutral-500 group-data-[selected=true]:text-primary">
                            Already have an account?
                          </span>
                        </div>
                      }
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="py-4"
                      >
                        <SignInForm onClose={onClose} />
                      </motion.div>
                    </Tab>
                    <Tab
                      key="register"
                      title={
                        <div className="flex flex-col gap-1">
                          <span>Register</span>
                          <span className="text-xs text-neutral-500 group-data-[selected=true]:text-primary">
                            Create a new account
                          </span>
                        </div>
                      }
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="py-4"
                      >
                        <RegisterForm onClose={onClose} />
                      </motion.div>
                    </Tab>
                  </Tabs>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white/50 px-4 text-neutral-600 backdrop-blur-sm dark:bg-neutral-900/50 dark:text-neutral-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    startContent={<FaShopify className="text-xl" />}
                    variant="bordered"
                    onPress={() => signIn('shopify')}
                    className="h-12 w-full bg-white/50 backdrop-blur-sm dark:bg-neutral-800/50"
                    classNames={{
                      base: 'border border-neutral-200 dark:border-neutral-700 transition-all hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-neutral-800/80'
                    }}
                  >
                    Continue with Shopify
                  </Button>
                </div>
              </div>
            </ModalBody>
          </motion.div>
        )}
      </ModalContent>
    </Modal>
  );
}
