import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { Link } from '@remix-run/react';
import { ChevronDown } from '../icons/ChevronDown';

const ListItem = React.forwardRef(({ className, children, title, ...props }, forwardedRef) => (
    <li>
        <NavigationMenu.Link asChild>
            <Link to="/">{children}</Link>
        </NavigationMenu.Link>
    </li>
));

export const NavigationMenuDemo = () => {
    return (
        <NavigationMenu.Root delayDuration={0} className="relative z-[1] flex w-screen">
            <NavigationMenu.List className="m-0 flex list-none">
                <NavigationMenu.Item>
                    <NavigationMenu.Trigger
                        asChild
                        onPointerMove={(event) => event.preventDefault()}
                        onPointerLeave={(event) => event.preventDefault()}
                    >
                        <Button
                            color="grey"
                            roundness="lg"
                            endIcon={<ChevronDown className="relative" aria-hidden />}
                            size="md"
                        >
                            All apps
                        </Button>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                        onPointerLeave={(event) => event.preventDefault()}
                        className="absolute top-0 left-0 w-auto rounded-3xl"
                    >
                        <ul className="m-0 w-64 p-3">
                            <ListItem href="https://stitches.dev/" title="Stitches">
                                Coinbase Wallet
                            </ListItem>
                            <ListItem href="/colors" title="Colors">
                                Second app
                            </ListItem>
                            <ListItem href="https://icons.radix-ui.com/" title="Icons">
                                One more
                            </ListItem>
                        </ul>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
            </NavigationMenu.List>

            <div className="absolute top-full left-0 flex w-full justify-center">
                <NavigationMenu.Viewport className="bg-grey-200 relative h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] rounded-3xl" />
            </div>
        </NavigationMenu.Root>
    );
};

export default NavigationMenuDemo;
