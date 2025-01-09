import { Box, Button, Link, Menu, MenuItem, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";

interface NavigationProps {
    links: Record<string, string | Record<string, string>>;
}

function Navigation({ links }: NavigationProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);

    const pathname = usePathname();
    const isLogin = pathname === "/login";

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        menuKey: string,
    ) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(menuKey);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setOpenMenu(null);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/">
                <Typography variant="h6" sx={{ mr: 2 }} color="#ffffff">
                    Bufkor
                </Typography>
            </Link>

            {!isLogin &&
                Object.entries(links).map(([key, value]) => {
                    if (typeof value === "string") {
                        return (
                            <Link key={key} href={value}>
                                <Button
                                    key={`${key}_button`}
                                    variant="text"
                                    style={{ color: "#ffffff" }}
                                >
                                    {key}
                                </Button>
                            </Link>
                        );
                    }

                    return (
                        <div key={key}>
                            <Button
                                color="inherit"
                                onClick={(event) => handleMenuOpen(event, key)}
                            >
                                {key}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu === key}
                                onClose={handleMenuClose}
                            >
                                {Object.entries(value).map(
                                    ([subKey, subValue]) => (
                                        <Link key={subKey} href={subValue}>
                                            <MenuItem
                                                key={`${key}_${subKey}`}
                                                onClick={handleMenuClose}
                                            >
                                                {subKey}
                                            </MenuItem>
                                        </Link>
                                    ),
                                )}
                            </Menu>
                        </div>
                    );
                })}
        </Box>
    );
}

export { Navigation };
