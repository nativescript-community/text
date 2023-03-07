<template>
    <Page>
        <ActionBar title="Simple Demo" />
        <StackLayout>
           <Button
        verticalTextAlignment="center"
        horizontalTextAlignment="center"
        textAlignment="center"
    >
    <FormattedString>
        <Span fontWeight="bold" text="A" verticalAlignment="center" fontSize="35" />
        <Span text="test" fontSize="24" verticalAlignment="center" />
    </FormattedString>
    </Button>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { Frame } from '@nativescript/core';

@Component
export default class Simple extends Vue {
    onBack() {
        Frame.topmost().goBack();
    }
}
</script>
