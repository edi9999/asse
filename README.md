ASSE
====

To try asse, just run

```
npx asse
```

You can also run following command **if noone else is seeing your screen or recording it**

```
npx asse --values
```

If you don't have npx, it comes with version 5.0 of npm.

You can also just run npm install, it will also work (with a postinstall script);

```
npm install asse
```

Reason of existence
===================

I have created this library to show how broken our current "Desktop systems" are. Any "application" that is running has the rights to do anything, from network-access to reading all "Personal Files", to passwords stored by third party applications. The only restriction is usually system wise, but on a personal computer, what is of value to a user is not the integrity of the system, but rather whether his private data is really private : eg can it be open by all programs without explicit permission ? I wish that we could find a solution to go forward (maybe docker based ?), so that the desktop apps will have the same amount of restrictions as applications on Android or iOS, or browser apps (which all run in a controlled sandbox).

I chose `npx` because it makes running third party programs even more "simple".

I hereby decline any responsibility if you use this program maliciously.

`asse` is the acronym for **A Simple Security Experiment**
