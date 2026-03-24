# OctoPrint-PortRetryPlus

Automatically reconnects your printer when the serial connection is lost.

This plugin periodically attempts to reconnect to the configured serial port, which is especially useful in environments where the device node remains present even when the printer is powered off.

Typical use cases:
Running OctoPrint inside LXC/Docker where /dev/ttyUSB* persists
Printers (e.g. some Prusa models) that do not properly remove the serial device when powered down

## Setup

Manually using this URL:

    https://github.com/hprombex/OctoPrint-PortRetryPlus/archive/master.zip

## Configuration

In ~/.octoprint/config.yaml, the interval can be configured to something other than the default 5 seconds.
There is also a settings page in the webui
```yaml
plugins:
  portretryplus:
    interval: 5
    forced_port: /dev/ttyUSB0
```

**Note:** Unlike the original plugin, this fork **can work even if `Serial Connection > General > Port` is set to `AUTO`**, as long as `forced_port` is configured in the plugin settings.

Example in `~/.octoprint/config.yaml`:

```yaml
serial:
  port: AUTO

plugins:
  portretryplus:
    forced_port: /dev/ttyUSB0
```
When you change the port from `AUTO` to something else, you will need to connect to the printer manually first (or restart the server).

## Misc

To keep your printer working without having to reboot the lxc every time you turn it on, I'm putting what I found here so that it may be of use for someone.

I found the idea [here](https://monach.us/automation/connecting-zwave-stick-under-lxc/) (instructions will be for my setup with the lxc id 108 and the serial port /dev/ttyUSB0)

* Check the info on the serial port
  ```bash
  $ ls -l /dev/ttyUSB0
  crw-rw---- 1 root dialout 188, 0 Sep 13 20:32 /dev/ttyUSB0
  ```
* Create the folder `/var/lib/lxc/108/devices`
* Run `cd /var/lib/lxc/108/devices && mknod -m 660 ttyUSB0 c 188 0` to create an always available device linking to the same device as `/dev/ttyUSB0`
* In the lxc config, add the newly created device to the lxc instead of `/dev/ttyUSB0`
  Also remember to map the dialout group (if your lxc is unprivileged), it has gid 20 for me
  ```bash
  lxc.cgroup.devices.allow: c 188:* rwm
  lxc.mount.entry: /var/lib/lxc/108/devices/ttyUSB0 dev/ttyUSB0 none bind,optional,create=file
  lxc.idmap: u 0 100000 20
  lxc.idmap: g 0 100000 20
  lxc.idmap: u 20 20 1
  lxc.idmap: g 20 20 1
  lxc.idmap: u 21 100021 65515
  lxc.idmap: g 21 100021 65515
  ```

## Credits

This project is based on [OctoPrint-PortRetry](https://github.com/vehystrix/OctoPrint-PortRetry) by vehystrix.

This fork introduces additional improvements, including smarter reconnect logic, forced serial port support, and more robust connection handling.
